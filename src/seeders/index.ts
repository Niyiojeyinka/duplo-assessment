import authorSeeder from "./20230824115222-seed-authors";
import postSeeder from "./20230824115223-seed-posts"

const runSeeders = async () => {
  await postSeeder();
  console.log("Post seeding completed");
  await authorSeeder();
  console.log("Author seeding completed");
};

runSeeders()