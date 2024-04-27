import dbClient from "../../db/db-client";
import { Response, Router } from "express";

import * as schema from "../../db/schema";
import { eq, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { genUniqId } from "../../utils/common";
import { isAdmin, verifyToken } from "../../middlewares";
import { calculatePaginationMetadata } from "../../utils/pagination";

let clients: any = [];
let newUser: any = [];

const router = Router();

// router.get("/:id", async (req, res, next) => {
//   // #swagger.tags = ['Users']
//   const { id } = req.params;

//   try {
//     const user = await dbClient()
//       .select()
//       .from(schema.users)
//       .where(eq(schema.users.id, id));

//     const { password, ...userData } = user[0];
//     res.json({
//       data: userData,
//     });
//   } catch (err) {
//     res.status(500);
//     return next(err);
//   }
// });

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
    await dbClient().insert(schema.users).values({
      email,
      password: hashedPassword,
      firstName: name,
      lastName: surName,
    });

    // newUser = [{ id: user[0].id, text: email, checked: false }, ...newUser];
    // sendToAllUsers();

    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    res.json({
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
      token,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

router.get("/", verifyToken, isAdmin, async (req, res) => {
  // #swagger.tags = ['Users']

  let page = 1;
  let limit = 20;
  if (req.query.page) {
    page = parseInt(req.query.page as string);
  }

  if (req.query.limit) {
    limit = parseInt(req.query.limit as string);
    if (limit < 20) {
      limit = 20;
    }
  }
  const total = await dbClient()
    .select({
      count: sql`count(*)`.mapWith(Number),
    })
    .from(schema.users);

  const metadata = calculatePaginationMetadata(total[0].count, page, limit);

  const users = await dbClient()
    .select()
    .from(schema.users)
    .limit(limit)
    .offset((page - 1) * limit);

  res.json({
    data: users,
    metadata,
  });
});

router.get("/account", verifyToken, async (req, res, next) => {
  // #swagger.tags = ['Users']
  const decoded = req.decoded;
  const email = decoded?.email!;

  // return res.json({ data: "ok" });

  try {
    const user = await dbClient()
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    const { password, ...userData } = user[0];

    res.json({
      data: userData,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});
router.put("/", verifyToken, async (req, res, next) => {
  // #swagger.tags = ['Users']
  const decoded = req.decoded;
  const email = decoded?.email!;
  const { firstName, lastName } = req.body;

  try {
    const user = await dbClient()
      .update(schema.users)
      .set({
        firstName,
        lastName,
      })
      .where(eq(schema.users.email, email))
      .returning({
        id: schema.users.id,
      });

    res.json({
      message: "user updated",
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res, next) => {
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
