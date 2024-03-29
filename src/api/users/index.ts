import dbClient from "../../db/db-client";
import { Response, Router } from "express";

import * as schema from "../../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { genUniqId } from "../../utils/common";

let clients: any = [];
let newUser: any = [];

const router = Router();

router.get("/", async (req, res) => {
  // #swagger.tags = ['Users']
  const users = await dbClient().select().from(schema.users);

  if (!users) {
    res.status(400);
    throw new Error("users not found");
  }

  res.json({
    data: users,
  });
});

router.get("/:id", async (req, res, next) => {
  // #swagger.tags = ['Users']
  const { id } = req.params;

  try {
    const user = await dbClient()
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));

    const { password, ...userData } = user[0];
    res.json({
      data: userData,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

router.post("/sign-up", async (req, res, next) => {
  // #swagger.tags = ['Auth']
  const { email, password, name, surName } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const user = await dbClient()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  // If the user already exists, return a conflict error
  if (user.length > 0) {
    res.status(409).json("User already exists");
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await dbClient()
      .insert(schema.users)
      .values({
        email,
        password: hashedPassword,
        firstName: name,
        lastName: surName,
      })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        firstname: schema.users.firstName,
        lastName: schema.users.lastName,
      });

    // newUser = [{ id: user[0].id, text: email, checked: false }, ...newUser];
    // sendToAllUsers();

    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    res.json({
      user: user[0],
      token,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});
router.post("/sign-in", async (req, res, next) => {
  // #swagger.tags = ['Auth']
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const user = await dbClient()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  // If the user already exists, return a conflict error
  if (user.length === 0) {
    res.status(401).json("Email or password is incorrect");
  }
  // Verify password
  if (!(await bcrypt.compare(password, user[0].password))) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    const { password, ...userData } = user[0];
    res.json({
      userData,
      token,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  // #swagger.tags = ['Users']
  const { id } = req.params;
  const { firstName, lastName } = req.body;

  try {
    const user = await dbClient()
      .update(schema.users)
      .set({
        firstName,
        lastName,
      })
      .where(eq(schema.users.id, id))
      .returning({
        id: schema.users.id,
      });

    res.json({
      data: user,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  // #swagger.tags = ['Users']
  const { id } = req.params;

  try {
    const user = await dbClient()
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning({
        id: schema.users.id,
      });

    res.json({
      data: user,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

router.get("/event", function (req, res) {
  // #swagger.ignore = true
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendData = `data: ${JSON.stringify(newUser)}\n\n`;
  res.write(sendData);

  const clientId = genUniqId();

  const newClient = {
    id: clientId,
    res,
  };
  clients.push(newClient);

  req.on("close", () => {
    console.log(`${clientId} - Connection closed`);
    clients = clients.filter((client: any) => client.id !== clientId);
  });
});

function sendToAllUsers() {
  for (let i = 0; i < clients.length; i++) {
    clients[i].res.write(`data: ${JSON.stringify(newUser)}\n\n`);
  }
}

export default router;
