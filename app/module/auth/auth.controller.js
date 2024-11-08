const Auth = require("./auth.model");
const to = require("await-to-js").default;
const cron = require("node-cron");
const sendEmail = require("../../utils/sendmail");
const generateSecureCode = require("../../utils/generateSecureCode");

const register = async (req, res) => {
  const { email, password } = req.body;

  let [findError, authExists] = await to(Auth.findOne({ email }));
  if (findError) return res.status(500).json({ error: error.message });
  if (authExists)
    return res.status(400).json({ error: "Email Already exists" });

  const verificationCode = generateSecureCode();
  const verificationCodeExpire = new Date(Date.now() + 1 * 60 * 1000);

  sendEmail(email, verificationCode);

  const [error, auth] = await to(
    Auth.create({
      email: email,
      password: password,
      verificationCode: verificationCode,
      verificationCodeExpire: verificationCodeExpire,
    })
  );
  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({
    message: "Registration successful, Verify your email",
    data: auth,
  });
};

const verify = async (req, res) => {
  const { email, verificationCode } = req.body;
  const [error, auth] = await to(Auth.findOne({ email }));
  if (error) return res.status(500).json({ error: error.message });
  if (!auth) return res.status(404).json({ error: "No User found" });

  const isMatch = verificationCode === auth.verificationCode;
  if (!isMatch)
    return res.status(401).json({ error: "Wrong Verification Code" });

  auth.isVerified = true;
  auth.verificationCode = "";

  const [saveError] = await to(auth.save());
  if (saveError) return res.status(500).json({ error: saveError.message });

  return res
    .status(200)
    .json({ message: "Verification successful", data: auth });
};

cron.schedule("*/1 * * * *", async () => {
  const now = new Date();
  const [error] = await to(
    Auth.updateMany(
      { verificationCodeExpire: { $lte: now } },
      { $set: { verificationCode: "", verificationCodeExpire: null } }
    )
  );

  if (error) {
    console.error("Error clearing expired verification codes:", error.message);
  } else {
    console.log(
      `Cleared expired verification codes at ${now.toLocaleString()}. ${
        result.modifiedCount
      } document(s) updated.`
    );
  }
});

const login = async (req, res) => {
  const { email, password } = req.body;

  const [error, auth] = await to(Auth.findOne({ email }));
  if (error) return res.status(500).json({ error: error.message });
  if (!auth) return res.status(404).json({ error: "No User found" });

  const isMatch = password === auth.password;
  if (!isMatch) return res.status(401).json({ error: "Invalid Credentials" });

  return res.status(200).json({ message: "Login Successful", data: auth });
};

const AuthController = {
  register,
  verify,
  login,
};

module.exports = AuthController;
