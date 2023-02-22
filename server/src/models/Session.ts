import Model from "./Model";


type SessionSchema = {
    sid?: string;
    sess?: string;
    expires?: string;
}

class Session extends Model<SessionSchema> {
    constructor(){
        super("session");
    }

}

const SessionModel = new Session();
export default SessionModel;