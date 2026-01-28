import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { pool } from "../config/connectDB.js";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// =========================================================
// GEMINI FUNCTION CALLING: TOOLS DEFINITION
// =========================================================

const tools = [
  {
    functionDeclarations: [
      {
        name: "getUpcomingActivities",
        description: "Get list of upcoming activities/events from the database. Use this when user asks about future events, workshops, or sessions.",
        parameters: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "Filter by activity type",
              enum: ["workshop", "session", "event", "competition"]
            },
            limit: {
              type: "number",
              description: "Maximum number of activities to return (default: 5)"
            }
          }
        }
      },
      {
        name: "getUserGems",
        description: "Get total gems and participation stats for a specific user by username",
        parameters: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "Username to lookup"
            }
          },
          required: ["username"]
        }
      },
      {
        name: "getActivityParticipants",
        description: "Get list of users who checked-in to a specific activity. Use when asking who attended/participated.",
        parameters: {
          type: "object",
          properties: {
            activityTitle: {
              type: "string",
              description: "Title or partial title of the activity to search for"
            }
          },
          required: ["activityTitle"]
        }
      },
      {
        name: "getTopRanking",
        description: "Get leaderboard/ranking of users with most gems",
        parameters: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Number of top users to return (default: 10)"
            }
          }
        }
      }
    ]
  }
];

// =========================================================
// FUNCTION IMPLEMENTATIONS
// =========================================================

async function executeFunctionCall(functionName, args) {
  try {
    switch (functionName) {
      case "getUpcomingActivities": {
        const limit = args.limit || 5;
        let query = `
          SELECT title, type, starts_at, ends_at, location, 
                 description, gem_amount, status
          FROM activities
          WHERE status IN ('upcoming', 'ongoing') 
            AND starts_at > NOW()
        `;

        const params = [];
        if (args.type) {
          query += ` AND type = $1`;
          params.push(args.type);
          query += ` ORDER BY starts_at LIMIT $2`;
          params.push(limit);
        } else {
          query += ` ORDER BY starts_at LIMIT $1`;
          params.push(limit);
        }

        const { rows } = await pool.query(query, params);
        return {
          activities: rows,
          count: rows.length
        };
      }

      case "getUserGems": {
        const { rows } = await pool.query(
          `SELECT username, total_gems, regular_session_count, 
                  club_role, is_active, join_club_at
           FROM users
           WHERE username = $1`,
          [args.username]
        );

        if (rows.length === 0) {
          return { error: `User '${args.username}' not found` };
        }

        return rows[0];
      }

      case "getActivityParticipants": {
        // First find activity by title (case insensitive search)
        const { rows: activities } = await pool.query(
          `SELECT id, title, type, starts_at
           FROM activities
           WHERE LOWER(title) LIKE LOWER($1)
           LIMIT 1`,
          [`%${args.activityTitle}%`]
        );

        if (activities.length === 0) {
          return { error: `Activity matching '${args.activityTitle}' not found` };
        }

        const activity = activities[0];

        // Get participants
        const { rows: participants } = await pool.query(
          `SELECT u.username, u.club_role, c.checked_at, c.status
           FROM check_ins c
           JOIN users u ON c.user_id = u.id
           WHERE c.activity_id = $1
           ORDER BY c.checked_at`,
          [activity.id]
        );

        return {
          activity: {
            title: activity.title,
            type: activity.type,
            starts_at: activity.starts_at
          },
          participants: participants,
          totalParticipants: participants.length
        };
      }

      case "getTopRanking": {
        const limit = args.limit || 10;
        const { rows } = await pool.query(
          `SELECT username, total_gems, regular_session_count, 
                  club_role, avatar
           FROM users
           WHERE is_active = true
           ORDER BY total_gems DESC, created_at ASC
           LIMIT $1`,
          [limit]
        );

        return {
          rankings: rows,
          count: rows.length
        };
      }

      default:
        return { error: `Function '${functionName}' not implemented` };
    }
  } catch (error) {
    console.error(`Error executing ${functionName}:`, error);
    return { error: error.message };
  }
}

// =========================================================
// ENDPOINTS
// =========================================================

export const getChatHistory = async (req, res) => {
  // Stateless: No history stored in DB.
  return res.json({ messages: [] });
};

export const getGeminiResponse = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }
    const text = message.trim();

    if (text.length > 1000) {
      return res.json({ error: "Message too long" });
    }

    // Prepare conversation history
    const contents = Array.isArray(history) ? [...history] : [];
    contents.push({ role: "user", parts: [{ text }] });

    // ✅ STEP 1: Send request with tools
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents,
      config: {
        tools: tools, // ✅ Enable function calling
        systemInstruction: `You are a helpful assistant for "GDG on Campus FPT University" Club. 
You have access to real-time database functions to answer questions about:
- Upcoming activities/events
- User gem points and rankings
- Activity participants
- Club member information

Use the available functions when users ask about specific data. 
Provide clear, concise, and friendly answers.`,
        temperature: 0.6,
        thinkingConfig: {
          includeThoughts: false,
        },
      },
    });

    // ✅ STEP 2: Check if Gemini wants to call a function
    const functionCall = response.functionCalls?.[0];

    if (functionCall) {
      console.log("🔧 Gemini requesting function call:", functionCall.name);

      // ✅ STEP 3: Execute the function
      const functionResult = await executeFunctionCall(
        functionCall.name,
        functionCall.args
      );

      console.log("✅ Function result:", JSON.stringify(functionResult, null, 2));

      // ✅ STEP 4: Send function result back to Gemini
      const finalResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [
          ...contents,
          { role: "model", parts: [{ functionCall }] },
          {
            role: "user",
            parts: [{
              functionResponse: {
                name: functionCall.name,
                response: functionResult
              }
            }]
          }
        ],
        config: {
          tools: tools,
          systemInstruction: `You are a helpful assistant for "GDG on Campus FPT University" Club. 
Format the function results into natural, friendly language. 
If there's an error in the function result, explain it politely.`,
          temperature: 0.6,
        },
      });

      const finalText = finalResponse?.text?.trim() || "I couldn't process that information.";

      return res.json({
        reply: finalText,
        functionCalled: functionCall.name,
        debug: {
          args: functionCall.args,
          result: functionResult
        }
      });
    }

    // ✅ No function call needed - direct text response
    const replyText = response?.text?.trim() || "I'm sorry, I don't have information...";
    return res.json({ reply: replyText });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: "Failed to fetch response from Gemini AI",
      details: error.message
    });
  }
};
