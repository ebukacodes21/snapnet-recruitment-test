import path from "path";
import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

export const runMigrations = async (sequelize: Sequelize) => {
  const migrationsPath = path.join(process.cwd(), "migrations/*.js");
  const umzug = new Umzug({
    migrations: {
      // glob: path.join(__dirname, "../../migrations/*.js"),
      glob: migrationsPath,
      resolve: ({ name, path, context }) => {
        const migration = require(path!);
        return {
          name,
          up: () => migration.up(context, Sequelize),
          down: () => migration.down(context, Sequelize),
        };
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  const result = await umzug.up();
  console.log(
    "migrations applied:",
    result.map((m) => m.name)
  );
};
