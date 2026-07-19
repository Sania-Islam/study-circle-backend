// Run this once with: npm run seed
// It creates Batch 58-66, each with the same 6 courses, matching
// the COURSE_LIBRARY in your frontend's data.js. Safe to re-run —
// it skips anything that already exists.

require("dotenv").config();
const connectDB = require("../config/db");
const Batch = require("../models/Batch");
const Course = require("../models/Course");

const COURSE_LIBRARY = [
  { key: "dsa", name: "Data Structures & Algorithms" },
  { key: "dbms", name: "Database Management Systems" },
  { key: "os", name: "Operating Systems" },
  { key: "cn", name: "Computer Networks" },
  { key: "se", name: "Software Engineering" },
  { key: "ai", name: "Artificial Intelligence" },
];

function defaultGroupFor(courseName) {
  const initials =
    courseName
      .split(" ")
      .filter((w) => /^[A-Z]/.test(w))
      .map((w) => w[0])
      .join("")
      .slice(0, 2) || courseName.slice(0, 2).toUpperCase();

  return {
    name: `${courseName.split(" ")[0]} Study Group`,
    initials: initials.toUpperCase(),
    members: [],
    messages: [],
  };
}

async function seed() {
  await connectDB();

  for (let num = 58; num <= 66; num++) {
    let batch = await Batch.findOne({ number: num });
    if (!batch) {
      batch = await Batch.create({ number: num, name: `Batch ${num}` });
      console.log(`Created ${batch.name}`);
    }

    for (const c of COURSE_LIBRARY) {
      const exists = await Course.findOne({ key: c.key, batchNumber: num });
      if (exists) continue;

      await Course.create({
        key: c.key,
        name: c.name,
        batchNumber: num,
        groups: [defaultGroupFor(c.name)],
      });
      console.log(`  Created course "${c.name}" in Batch ${num}`);
    }
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
