# Development Notes & Tips

## 📝 Important Information

### Application Structure
- **Main App**: `src/App.js` - Contains all routing logic
- **State**: `src/context/AppContext.js` - Global state for services, blogs, testimonials, messages
- **Styling**: `src/index.css` - Tailwind CSS + custom styles
- **Data**: `src/data/dummyData.js` - All dummy data

### How State Works

The app uses **Context API** for global state management:

```javascript
// Access state anywhere:
const { services, blogs, testimonials } = useContext(AppContext);

// Add new service:
const { addService } = useContext(AppContext);
addService({
  title: "New Service",
  description: "...",
  icon: "🎯",
  details: "...",
  price: "..."
});

// Update:
updateService(id, updatedData);

// Delete:
deleteService(id);
```

### Component Organization

**Reusable Components** (`src/components/`)
- Used across multiple pages
- Receive props for customization
- Example: `ServiceCard`, `BlogCard`

**Pages** (`src/pages/`)
- Full page components
- Combine multiple sections
- Example: `Home.jsx`, `Blog.jsx`

**Admin Pages** (`src/admin/`)
- Dashboard functionality
- CRUD operations
- Access through `/admin/*` routes

## 🎨 Styling Reference

### Color Scheme
- **Primary**: Indigo (#6366f1)
- **Secondary**: Pink (#ec4899)
- **Dark**: Dark Gray (#1f2937)

### Using Tailwind CSS
```jsx
className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:shadow-lg transition"
```

### Custom Component Classes
Available in `index.css`:
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.section-title` - Section heading
- `.card-hover` - Card hover effect

## 🔄 Adding New Features

### Add a New Service Type

1. **Add to dummyData.js**
   ```javascript
   {
     id: 7,
     title: "AI Solutions",
     description: "...",
     icon: "🤖",
     details: "...",
     price: "..."
   }
   ```

2. **Use in Admin Panel**
   - Go to /admin/services
   - Click "+ Add Service"
   - Fill form and submit

3. **Displays Automatically**
   - Home page services section
   - Admin dashboard list

### Add a New Blog Post

1. **Option 1: Via Admin Panel**
   - Go to /admin/blogs
   - Click "+ Add Blog"
   - Fill in all fields

2. **Option 2: Edit dummyData.js**
   - Add to `blogsData` array
   - Must include: id, title, description, content, image, author, date, category

### Modify Contact Form

Edit `src/pages/Contact.jsx`:

```javascript
// Fields are defined in the form
// Messages stored in context via addContactMessage()
// View messages in /admin/messages
```

## 🚀 Performance Tips

1. **Images**: Use external URLs (Unsplash, Pexels)
2. **Animations**: Framer Motion handles performance
3. **Code Splitting**: React Router splits by route
4. **Build**: `npm run build` creates optimized bundle

## 🔧 Common Customizations

### Change Company Name
1. `src/components/Navbar.jsx` - Logo text
2. `src/components/Utils.jsx` - Footer text
3. `tailwind.config.js` - Colors

### Add Navigation Links
1. Edit `src/components/Navbar.jsx`
2. Add to `navLinks` array
3. Update routing in `src/App.js`

### Customize Hero Section
1. Edit `src/pages/Home.jsx`
2. Modify `<Hero>` component props
3. Change `heroActions` array

### Add Social Links
1. Edit `src/components/Utils.jsx` - Footer
2. Update social media links
3. Add your profiles

## 📱 Responsive Breakpoints

Tailwind CSS breakpoints used:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

Example responsive class:
```jsx
className="text-base md:text-lg lg:text-xl"
```

## 🎯 Form Handling

All forms use controlled components:

```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  // ...
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSubmit = (e) => {
  e.preventDefault();
  // Process form data
  onSubmit(formData);
};
```

## 🔐 Future Auth Implementation

The app is structured for easy auth addition:

1. Add auth context similar to `AppContext`
2. Add login/register pages
3. Protect admin routes with `PrivateRoute` component
4. Store JWT token in localStorage

## 📊 API Integration Checklist

When connecting to backend:

- [ ] Update `REACT_APP_API_URL` in `.env`
- [ ] Test API endpoints in Postman
- [ ] Replace `useState` with API calls in AppContext
- [ ] Add loading states to components
- [ ] Add error handling
- [ ] Test authentication
- [ ] Verify data persistence

## 🐛 Debugging Tips

1. **React DevTools**: Install browser extension
2. **Console**: Check browser console for errors
3. **Network Tab**: Monitor API calls
4. **Component Props**: Use React DevTools to inspect

## 📦 Dependency Notes

- **React 19**: Latest features available
- **Tailwind 3.3**: Compatible with all CSS needs
- **Framer Motion**: Smooth animations without config
- **React Router v6**: Latest routing patterns
- **Axios**: Pre-configured with interceptors

## 🎓 Learning Resources

- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- React Router: https://reactrouter.com/
- React Hooks: https://react.dev/reference/react/hooks

## 💡 Code Quality Tips

1. **Component Naming**: PascalCase for components
2. **File Organization**: Group related files
3. **Props**: Document with PropTypes or TypeScript
4. **Comments**: Add comments for complex logic
5. **Avoid Props Drilling**: Use Context API

## 🚀 Deployment Checklist

Before deploying:

- [ ] Complete UI testing
- [ ] Test all routes
- [ ] Check mobile responsiveness
- [ ] Remove console.log statements
- [ ] Add meta tags for SEO
- [ ] Optimize images
- [ ] Test on real devices
- [ ] Setup environment variables

## 📞 Quick Reference

### File Locations
- Components: `src/components/`
- Pages: `src/pages/`
- Admin: `src/admin/`
- Dummy Data: `src/data/dummyData.js`
- Global State: `src/context/AppContext.js`
- API Service: `src/services/api.js`
- Styles: `src/index.css`
- Config: `tailwind.config.js`

### Import Examples
```javascript
// Components
import { Navbar } from './components/Navbar';
import { ServiceCard } from './components/Cards';

// Pages
import Home from './pages/Home';

// Context
import { useContext } from 'react';
import { AppContext } from './context/AppContext';

// API
import { servicesAPI } from './services/api';
```

---

**Pro Tip**: Save this file for reference during development!
