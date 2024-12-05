import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "user",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: true,
      unique: true,
    },
    nickname: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    is_admin: {
      type: "varchar",
      length: 30,
      nullable: true,
    },
    platform: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    exp: {
      type: "int",
      default: 0,
    },
    win: {
      type: "int",
      default: 0,
    },
    lose: {
      type: "int",
      default: 0,
    },
    roles: {
      type: "varchar",
      length: 10,
      default: "USER",
    },
    created_at: {
      type: "datetime",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "datetime",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
});

export default User;
