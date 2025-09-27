const AuthService = require("./auth.service");

exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = "STUDENT" } = req.body;

    const result = await AuthService.signup({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    if (result.user && result.user.id) {
      req.user = { id: result.user.id };

      res.locals.user = {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        avatar: result.user.avatar,
        bio: result.user.bio,
        isActive: result.user.isActive,
        emailVerified: result.user.emailVerified,
        createdAt: result.user.createdAt,
      };

      req.saveUserSession({
        lastLogin: new Date(),
        signupDate: new Date(),
        userId: result.user.id,
        preferences: {
          theme: "light",
          notifications: true,
          language: "en",
        },
      });

      req.saveUserPreferences({
        theme: "light",
        notifications: true,
        language: "en",
        emailUpdates: true,
      });
    }

    res.status(201).json({
      message: "User created successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.message === "User already exists") {
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    if (result.user && result.user.id) {
      req.user = { id: result.user.id };

      res.locals.user = {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        avatar: result.user.avatar,
        bio: result.user.bio,
        isActive: result.user.isActive,
        emailVerified: result.user.emailVerified,
        createdAt: result.user.createdAt,
      };

      req.saveUserSession({
        lastLogin: new Date(),
        loginCount: (req.getUserSession()?.data?.loginCount || 0) + 1,
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
        userId: result.user.id,
      });

      const userPreferences = req.getUserPreferences();
      if (userPreferences.success) {
        res.locals.userPreferences = userPreferences.data;
      }
    }

    res.json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (error.message === "Account is deactivated") {
      return res.status(403).json({ error: "Account is deactivated" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userId = res.locals?.user?.id || req.user?.id;

    const result = await AuthService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    if (userId) {
      req.saveUserSession({
        passwordChanged: new Date(),
        passwordChangeCount:
          (req.getUserSession()?.data?.passwordChangeCount || 0) + 1,
      });
    }

    res.json({ message: result.message });
  } catch (error) {
    console.error("Change password error:", error);
    if (error.message === "Current password is incorrect") {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await AuthService.verifyEmail(userId);

    res.json({
      message: "Email verified successfully",
      user: result,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.toggleAccountStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await AuthService.toggleAccountStatus(userId);

    res.json({
      message: "Account status updated successfully",
      user: result,
    });
  } catch (error) {
    console.error("Toggle account status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
