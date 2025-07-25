import { OAuth2Client } from "google-auth-library";
import envvars from "../constants/envvars";

const oauthClient = new OAuth2Client(envvars.GOOGLE_CLIENT_ID);

export default oauthClient;
