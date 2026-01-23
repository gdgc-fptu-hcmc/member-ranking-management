import crypto from "crypto";


export const ensureGuestId = (req, res, next) => {
    try {
        let guestId = req.cookie?.guestId;

        if(!guestId){
            guestId = crypto.randomUUID();

            res.cookie("guestId", guestId, {
                httpOnly: true,
                samesite: "lax",
                path:"/",
                maxAge: 1000*60*60*24*30,//30 days
            })
        }
        req.guestId = guestId;
        next();

    } catch (error) {
        next(error);
    }
}