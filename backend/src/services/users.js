import prisma from '../prisma.js';
import { hashPassword, comparePassword, generateToken } from '../auth.js';

export function registerUsersService(app) {
  // Register user
  app.post('/api/users/register', async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Todos los campos son requeridos (email, password, name)' });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      }

      const hashedPassword = hashPassword(password);
      // Default to USER unless explicitly provided valid role
      const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: userRole
        },
        select: { id: true, email: true, name: true, role: true, createdAt: true }
      });

      const token = generateToken(user);
      return res.status(201).json({ user, token });
    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
  });

  // Login
  app.post('/api/users/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Por favor ingresa email y contraseña.' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Credenciales inválidas.' });
      }

      const isValid = comparePassword(password, user.password);
      if (!isValid) {
        return res.status(400).json({ error: 'Credenciales inválidas.' });
      }

      const userProfile = { id: user.id, email: user.email, name: user.name, role: user.role };
      const token = generateToken(userProfile);
      return res.json({ user: userProfile, token });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
  });

  // Me / Profile
  app.get('/api/users/me', async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado.' });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    return res.json(user);
  });
}
