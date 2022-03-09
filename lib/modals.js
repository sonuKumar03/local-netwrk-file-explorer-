const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../lib/db");
class Files extends Model {}

class Paths extends Model {}
class Thumbnails extends Model {}
class Types extends Model {}

Paths.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    path: { type: DataTypes.STRING, allowNull: false },
    hash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    sequelize,
    tableName: "paths",
    modelName: "paths",
  }
);

Thumbnails.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    }
  },
  {
    sequelize,
    modelName: "thumbnails",
    tableName: "thumbnails",
    timestamps: false,
  }
);

Types.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  { sequelize, tableName: "types", modelName: "types", timestamps: false }
);

Files.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "files",
    tableName: "files",
    timestamps: false,
  }
);


Thumbnails.belongsTo(Paths);
Files.belongsTo(Types);
Files.belongsTo(Thumbnails);
Files.belongsTo(Paths);

async function initDatabase() {
  await sequelize.sync({ alter: true });
  console.log("DB CREATED");
}
async function cleanDatabase() {
  // sequelize.dropAllSchemas();
  await initDatabase();
  await createTypes();
}

async function createTypes() {
  let types = ["image", "video", "docs"];
  for (type of types) {
    await Types.create({
      name: type,
    });
  }
}

module.exports = {
  Paths,
  Files,
  Thumbnails,
  Types,
  cleanDatabase,
};
