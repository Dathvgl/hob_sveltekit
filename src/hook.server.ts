import { mongo } from "./database/mongodb";

mongo().catch((e) => console.error(e));
