import { Request } from "express";

interface MyContext {
  req: Request;
}

export default MyContext;
