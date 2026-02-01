// Role-based access control middleware

// Check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Check if user has admin role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Check if user has admin or kontributor role
const requireKontributorOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.role !== 'admin' && req.user.role !== 'kontributor') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

// Filter query based on user role for custom articles
const filterByAuthor = (req, query, params = []) => {
  if (req.user.role === 'kontributor') {
    // Kontributor can only see their own articles
    query += ' AND author_id = $' + (params.length + 1);
    params.push(req.user.id);
  }
  // Admin can see all articles
  return { query, params };
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireKontributorOrAdmin,
  filterByAuthor
};
