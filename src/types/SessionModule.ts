import { SessionData } from "express-session";
import { Application } from "express";
export interface SessionModule extends Application, SessionData {}
