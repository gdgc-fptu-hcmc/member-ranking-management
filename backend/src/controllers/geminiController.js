import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { upsertChatSessionForGuest, upsertChatSessionForUser } from "./chatSessionService.js";
import { pool } from "../config/connectDB.js";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const toGeminiContents = (rows) =>
  rows.map((r) => ({ role: r.role, parts: [{ text: r.content }] }));


async function getOrCreateSession(req) {
    if(req.user?.id){
      const s = await upsertChatSessionForUser(req.user.id);
      return { sessionId: s.id, isUser: true};
    }

    const guestId = req.guestId;
    const s = await upsertChatSessionForGuest(guestId);
    return { sessionId: s.id, isUser: false};
}
async function resetIfExpired(sessionId) {
  // lấy expires_at tại sessionId
  //check thử có quá hạn chưa nếu quá hạn thì xóa chat_message dựa trên sessioId
  //sau đó update lại cái expires_at của nó
  const { rows } = await pool.query(
    `
    select expires_at from public.chat_sessions where id=$1
    `,[sessionId]
  );
  if(rows.length===0) return;
  const expireAt = new Date( rows[0].expires_at);
  if( new Date() > expireAt){
    await pool.query(`delete from public.chat_messages where session_id=$1`,[sessionId]);
    await pool.query(
      `
      update public.chat_sessions set expires_at = now() + interval '1 day', updated_at = now() where id=$1
      `,[sessionId]
    );
  }
}

export const getChatHistory = async (req, res) => {
  try {
    //xác định ss hiện tại xem có trắng kh để reset
      const {sessionId} = await getOrCreateSession(req);
      await resetIfExpired(sessionId);

      const limit = Math.min(parseInt(req.query.limit|| "20",10), 50);
    // lấy tn mới nhất ra
      const m = await pool.query(
        `
        select role, content, created_at from public.chat_messages where session_id=$1 order by created_at desc limit $2
        `,[sessionId, limit]
      );
      const messages = m.rows.reverse().map((x)=>({
        sender: x.role==="user" ? "user":"bot",
        text: x.content,
        created_at: x.created_at
      }));
      return res.json({messages});
  } catch (error) {
    console.log(error);
    return res.status(500).json("lỗi khi truy xuất lịch sử tn");
    
  }
};

export const getGeminiResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    if ( typeof message !== "string"|| !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }
    const text = message.trim();

    if(text.length > 1000){
      return res.json({error: "Message too long"});
    }

    const {sessionId} = await getOrCreateSession(req);
    await resetIfExpired(sessionId);

    const N = 20;
    const m = await pool.query(
      `
      select role, content from public.chat_messages where session_id=$1 order by created_at desc limit $2
      `,[sessionId,N]
    )
    const history = m.rows.reverse();
    const contents = toGeminiContents(history);
    contents.push({ role: "user", parts: [{ text }] });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
      config: {
        systemInstruction: `You are a helpful assistant for "GDG on Campus FPT University" Club. Provide concise and relevant answers about the club's activities, membership, events, and other related information. When you answer, only use text and not markdowns. If you don't know the answer, respond with "I'm sorry, I don't have that information at the moment."`,
        temperature: 0.6,
        thinkingConfig: {
          includeThoughts: false,
        }
    }
    });

    const replyText = response?.text.trim()|| "I'm sorry, I don't have information...";

    await pool.query("begin"); // Bắt đầu giao dịch (đảm bảo tính toàn vẹn).
    await pool.query(
      `insert into public.chat_messages(session_id, role, content) values ($1,'user',$2)`,
      [sessionId, text] // Lưu tin của User.
    );
    await pool.query(
      `insert into public.chat_messages(session_id, role, content) values ($1,'model',$2)`,
      [sessionId, replyText] // Lưu tin của Bot.
    );
    await pool.query(
      `update public.chat_sessions set updated_at=now() where id=$1`,
      [sessionId] // Cập nhật thời điểm tương tác mới nhất.
    );
    await pool.query("commit"); // Hoàn tất giao dịch.


    return res.json({ reply: replyText });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to fetch response from Gemini AI" });
  }
};