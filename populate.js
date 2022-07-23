import { readFile } from "fs/promises";

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connection.js";

import Job from "./models/Job.js";

const start = async () => {
  try {
    //  connect Db
    await connectDB(process.env.MONGO_URL);
    // delete job tables items
    await Job.deleteMany();
    // read json file
    const jsonProducts = JSON.parse(
      await readFile(new URL("./mock-data.json", import.meta.url))
    );
    //  use json file create new Job items
    await Job.create(jsonProducts);
    // succsess message
    console.log("success!!");
    process.exit(0);
  } catch (error) {
    // error message
    console.log(error);
    process.exit(1);
  }
};

// start this function
start();
