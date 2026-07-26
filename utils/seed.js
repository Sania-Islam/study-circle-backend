// Run this once with: npm run seed
require("dotenv").config();
const connectDB = require("../config/db");
const Batch = require("../models/Batch");
const Course = require("../models/Course");

const COURSE_CATALOG = {
  dsa:  "Data Structures & Algorithms",
  dbms: "Database Management Systems",
  os:   "Operating Systems",
  cn:   "Computer Networks",
  sedp: "Software Engineering & Design Pattern",
  ai:   "Artificial Intelligence",
  ml:   "Machine Learning",
  web:  "Web Development",
  math: "Discrete Mathematics",
  BiC:  "Bioinformatics Computing",
  CC:   "Compiler Construction",
  toc:  "Theory of Computation",
  bc:   "Business Communication",
  coa:  "Computer Organization & Architecture",
  "mp&i": "Microprocessor & Interfacing",
  cp:   "Competitive Programming",
  "g&va": "Geometry & Vector Analysis",
  oop:  "Object Oriented Programming",
  eecl: "Engineering Ethics and Cyber Law",
  bsp:  "Basic Statistics & Probability",
  imfa: "Industrial Management & Financial Accounting",
  mat: "Industrial Management & Financial Accounting",
  dld : "Digital Logic Design",
  ada : "Algorithm Design and Analysis",
  pe&ed: "Principles of Economics & Entrepreneurship Development",
  its : "Principles of Economics & Entrepreneurship Development",
  mgv : "Matrices, Geometry and Vector Analysi2",
  bee : "Basic Electrical And Electronic Circuits",
  psy : "Introduction to Psychology",
  bs : "Bangladesh Studie",
  sp : "Structured Programming",
  math : "Mathematical Methods and Complex Variable",
  eng : "English",
  phy : "Physics",
  dic : "Differential and Integral Calculus",
  dm: "Discrete Mathematics",
};

const BATCH_COURSES = {
  58: ["cn", "BiC", "CC"],
  59: ["sedp", "ml", "toc"],
  60: ["coa", "os", "bc"],
  61: ["cp", "dbms", "mp&i", "g&va"],
  62: ["oop", "bsp", "eecl", "imfa"],
  63: ["mat", "dld", "ada", "pe&ed"],
  64: ["its", "mgv", "bee", "dsa"],
  65: ["psy", "bs", "sp", "math"],
  66: ["eng", "phy", "dic", "dm"],
};

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

  // Clear out the old generic courses (they were wrong for every batch)
  const deleted = await Course.deleteMany({});
  console.log(`Removed ${deleted.deletedCount} old course(s).`);

  for (let num = 58; num <= 66; num++) {
    let batch = await Batch.findOne({ number: num });
    if (!batch) {
      batch = await Batch.create({ number: num, name: `Batch ${num}` });
      console.log(`Created ${batch.name}`);
    }

    const keys = BATCH_COURSES[num] || [];
    for (const key of keys) {
      const name = COURSE_CATALOG[key];
      if (!name) {
        console.warn(`  Skipping unknown course key "${key}" for Batch ${num}`);
        continue;
      }
      await Course.create({
        key,
        name,
        batchNumber: num,
        groups: [defaultGroupFor(name)],
      });
      console.log(`  Created course "${name}" in Batch ${num}`);
    }
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
