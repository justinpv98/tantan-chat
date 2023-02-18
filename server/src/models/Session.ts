import Model from "./Model";


type SessionData = {
    sid?: string;
    sess?: string;
    expires?: string;
}

class Session extends Model<SessionData> {
    constructor(){
        super("session");
    }

}

const SessionModel = new Session();
export default SessionModel;