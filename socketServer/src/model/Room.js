import { EntitySchema } from "typeorm";
// import User from "./User";

const Room = new EntitySchema({
  name: "Room",
  tableName: "room",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    user_id: {
      type: "int",
      nullable: true,
    },
    subject_id: {
      type: "int",
      nullable: false,
    },
    created_at: {
      type: "datetime",
      default: () => "CURRENT_TIMESTAMP",
      createDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      onDelete: "SET NULL",
      joinColumn: { name: "user_id" },
    },
  },
});

export default Room;
