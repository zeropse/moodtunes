# Contributing to Mood Music

Thank you for your interest in contributing to Mood Music! This guide will help you get started with contributing to our AI-powered playlist generator.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm (preferred) or npm
- Git
- A Spotify Developer account
- Basic knowledge of React, Next.js, and JavaScript/TypeScript

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/yourusername/mood-music.git
   cd mood-music
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Add your Spotify API credentials
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Run tests to ensure everything works**
   ```bash
   pnpm test
   ```

## 🎯 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug fixes**: Fix issues and improve stability
- **✨ New features**: Add new mood categories, improve analysis, enhance UI
- **📚 Documentation**: Improve docs, add examples, write tutorials
- **🧪 Tests**: Add test coverage, improve test quality
- **🎨 Design**: Improve UI/UX, add new themes, enhance accessibility
- **⚡ Performance**: Optimize code, improve loading times, enhance animations

### Contribution Workflow

1. **Check existing issues** or create a new one to discuss your idea
2. **Fork the repository** and create a feature branch
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Submit a pull request** with a clear description

## 🏗️ Development Guidelines

### Code Style

We use ESLint and Prettier to maintain consistent code style:

```bash
# Check linting
pnpm lint

# Fix linting issues
pnpm lint --fix

# Format code
pnpm format
```

### Coding Standards

- **Use TypeScript** for new files when possible
- **Write meaningful variable and function names**
- **Add JSDoc comments** for public functions
- **Follow React best practices** (hooks, functional components)
- **Use Tailwind CSS** for styling
- **Implement proper error handling**

### Example Code Style

```javascript
/**
 * Analyzes user mood text and returns music characteristics
 * @param {string} moodText - User's mood description
 * @returns {Promise<MoodAnalysisResult>} Analysis results
 */
export async function analyzeMood(moodText) {
  try {
    // Validate input
    const validation = validateMoodInput(moodText);
    if (!validation.isValid) {
      throw new MoodAnalysisError(validation.error);
    }

    // Process mood analysis
    const result = await processMoodAnalysis(moodText);
    return result;
  } catch (error) {
    console.error("Mood analysis failed:", error);
    return getFallbackMoodResult();
  }
}
```

### Component Guidelines

- **Use functional components** with hooks
- **Implement proper prop validation**
- **Handle loading and error states**
- **Ensure accessibility** (ARIA labels, keyboard navigation)
- **Make components responsive**

```jsx
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

const MoodInput = ({ onSubmit, isLoading = false }) => {
  const [mood, setMood] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (mood.trim().length < 3) {
        setError("Please describe your mood with at least 3 characters");
        return;
      }
      onSubmit(mood.trim());
    },
    [mood, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="mood-input"
          className="block text-sm font-medium text-gray-700"
        >
          How are you feeling today?
        </label>
        <textarea
          id="mood-input"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border-gray-300"
          aria-describedby={error ? "mood-error" : "mood-help"}
          aria-invalid={!!error}
        />
        {error && (
          <p id="mood-error" role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || mood.trim().length < 3}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
      >
        {isLoading ? "Analyzing..." : "Generate Playlist"}
      </button>
    </form>
  );
};

MoodInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default MoodInput;
```

## 🧪 Testing Guidelines

### Test Requirements

All contributions should include appropriate tests:

- **Unit tests** for utility functions and components
- **Integration tests** for API endpoints
- **End-to-end tests** for user workflows
- **Accessibility tests** for UI components

### Writing Tests

```javascript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MoodInput from "../MoodInput";

describe("MoodInput Component", () => {
  it("should validate input and show error for short text", async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<MoodInput onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/how are you feeling/i);
    const button = screen.getByRole("button", { name: /generate playlist/i });

    await user.type(input, "hi");
    await user.click(button);

    expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should submit valid input", async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<MoodInput onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText(/how are you feeling/i);
    await user.type(input, "I feel happy today!");
    await user.click(screen.getByRole("button"));

    expect(mockOnSubmit).toHaveBeenCalledWith("I feel happy today!");
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage

# Run specific test file
pnpm test src/components/__tests__/MoodInput.test.jsx
```

## 🎨 Design Guidelines

### UI/UX Principles

- **Accessibility first**: Support screen readers, keyboard navigation
- **Mobile responsive**: Design for all screen sizes
- **Performance**: Smooth animations, fast loading
- **User feedback**: Clear loading states, error messages
- **Consistency**: Follow established design patterns

### Color Palette

```css
/* Primary Colors */
--color-primary: #4ecdc4;
--color-secondary: #44a08d;
--color-accent: #ff6b6b;

/* Mood Colors */
--color-happy: #ffd700;
--color-sad: #4a5568;
--color-energetic: #ff4081;
--color-calm: #81c784;
--color-anxious: #9575cd;
--color-romantic: #f06292;
--color-nostalgic: #a1887f;
--color-angry: #e57373;
```

### Animation Guidelines

- **60fps target**: Ensure smooth animations
- **Respect reduced motion**: Check `prefers-reduced-motion`
- **Progressive enhancement**: Work without animations
- **Performance**: Use CSS transforms and opacity

## 📝 Documentation

### Documentation Standards

- **Clear and concise**: Easy to understand
- **Code examples**: Show practical usage
- **Up-to-date**: Keep in sync with code changes
- **Accessible**: Use proper headings and structure

### API Documentation

Document all API endpoints with:

```javascript
/**
 * POST /api/analyze-mood
 *
 * Analyzes user mood text and returns music characteristics
 *
 * @param {Object} request - Request object
 * @param {string} request.moodText - User's mood description (3-500 chars)
 *
 * @returns {Object} Response object
 * @returns {boolean} response.success - Whether analysis succeeded
 * @returns {Object} response.data - Analysis results
 * @returns {string} response.data.mood - Detected mood category
 * @returns {number} response.data.confidence - Confidence score (0-1)
 * @returns {string[]} response.data.genres - Recommended music genres
 *
 * @example
 * // Request
 * POST /api/analyze-mood
 * {
 *   "moodText": "I'm feeling happy and energetic today!"
 * }
 *
 * // Response
 * {
 *   "success": true,
 *   "data": {
 *     "mood": "happy",
 *     "confidence": 0.85,
 *     "genres": ["pop", "dance"]
 *   }
 * }
 */
```

## 🚀 Feature Development

### Adding New Mood Categories

1. **Update mood categories** in `src/lib/mood-categories.js`
2. **Add mood mapping** in `src/lib/mood-mappings.js`
3. **Create background theme** in `src/lib/background-themes.js`
4. **Add keywords** for detection
5. **Write tests** for the new mood
6. **Update documentation**

### Adding New Features

1. **Create an issue** to discuss the feature
2. **Design the API** if needed
3. **Implement the feature** with tests
4. **Update documentation**
5. **Test thoroughly** across devices
6. **Submit pull request**

## 🐛 Bug Reports

### Reporting Bugs

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (browser, OS, device)
- **Screenshots or videos** if helpful
- **Console errors** if any

### Bug Report Template

```markdown
## Bug Description

A clear description of what the bug is.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Enter '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Environment

- Browser: [e.g. Chrome 91]
- OS: [e.g. macOS 12.0]
- Device: [e.g. iPhone 12]
- Version: [e.g. 1.2.3]

## Additional Context

Any other context about the problem.
```

## 📋 Pull Request Guidelines

### PR Checklist

Before submitting a pull request:

- [ ] **Code follows style guidelines**
- [ ] **Tests pass** (`pnpm test`)
- [ ] **Linting passes** (`pnpm lint`)
- [ ] **New tests added** for new functionality
- [ ] **Documentation updated** if needed
- [ ] **Accessibility tested** with screen reader
- [ ] **Mobile responsive** design verified
- [ ] **Performance impact** considered

### PR Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Accessibility testing completed

## Screenshots

If applicable, add screenshots of UI changes.

## Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Accessibility verified
```

## 🏷️ Issue Labels

We use labels to categorize issues:

- **`bug`**: Something isn't working
- **`enhancement`**: New feature or request
- **`documentation`**: Improvements to docs
- **`good first issue`**: Good for newcomers
- **`help wanted`**: Extra attention needed
- **`performance`**: Performance improvements
- **`accessibility`**: Accessibility improvements
- **`ui/ux`**: User interface/experience

## 🎉 Recognition

Contributors are recognized in:

- **README.md** contributors section
- **CHANGELOG.md** for significant contributions
- **GitHub releases** for major features

## 📞 Getting Help

If you need help:

- **Check existing issues** and documentation
- **Join our discussions** on GitHub
- **Ask questions** in issues with `question` label
- **Reach out** to maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Mood Music! 🎵✨
