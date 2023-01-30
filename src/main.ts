import { Start } from "../src/repl/repl.ts";
import { parse } from "https://deno.land/std@0.175.0/flags/mod.ts";


console.log("\n Hello! This is the Monkey programming language! \n")
Start(parse(Deno.args)["_"][0] as string, parse(Deno.args)["debug"]);
