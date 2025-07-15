# Nuptily Infinite Agentic Loop Project

## Project Overview
This project implements an infinite agentic loop system using Claude Code's custom commands to generate luxury wedding planning UI components based on the **Nuptily Integrated Design System v2.0**.

## Design Philosophy: "Luxury Through Layered Elegance"

The Nuptily design system combines three cutting-edge design trends to create interfaces that match the importance and joy of wedding planning:

### The Three Pillars of Modern Luxury Design
1. **Aurora UI** - Organic, living backgrounds with gradient animations
2. **Glassmorphism** - Transparent elegance with depth and blur effects  
3. **Neumorphism** - Soft, tactile interfaces with realistic shadows

### Component Architecture
Every component follows the **Hybrid Component Architecture**:
```
Aurora Background Layer (z-index: 1)
├── Glass Middle Layer (z-index: 20)
    └── Neumorphic Content Layer (z-index: 30)
```

## Key Concepts

### Parallel Agent Architecture
- Multiple Sub Agents work simultaneously
- Each agent receives unique creative direction focused on luxury wedding planning
- Agents operate independently but maintain design system coherence

### Progressive Enhancement
- Each wave builds on previous iterations
- Increasing sophistication in wedding-specific functionality
- Pattern recognition and adaptation for luxury aesthetics

### Context Management
- Efficient summarization of existing components
- Smart batching to maximize context usage
- Graceful handling of context limits while maintaining design quality

## Design System Features

### Wedding-Specific Components
- **Romantic Interactions**: Micro-animations, celebration effects, sparkle transitions
- **Couple-Centric Workflows**: Guest management, vendor selection, timeline planning
- **Luxury Aesthetics**: Gold accents, pearl backgrounds, navy color schemes

### AI-Enhanced Interfaces
- **Conversational UI**: AI chat with luxury styling and glass frames
- **Voice Visualizers**: Audio interaction feedback with aurora effects
- **Smart Suggestions**: AI-powered recommendations with trust indicators
- **Avatar Containers**: AI video avatar frames with neumorphic styling

### Instant Messenger System
- **Real-time Communication**: WebRTC video/audio calling with peer-to-peer connectivity
- **Media Sharing**: Photo upload, camera capture, video recording with storage integration
- **Global Integration**: Accessible from any page via messengerUtils API
- **Luxury Wedding Styling**: Glassmorphic and neumorphic design patterns
- **Mobile Optimization**: Responsive design with touch-friendly interfaces
- **Center/Corner Positioning**: Dynamic positioning based on context (center popup vs corner minimized)
- **Dashboard Interaction**: Intelligent opacity and z-index handling when dashboard is active

### Security-First Design
- **Trust Indicators**: Visual feedback for secure transactions
- **Privacy Controls**: Luxury-styled privacy settings
- **Biometric Auth**: Fingerprint and face recognition interfaces
- **Payment Security**: Secure payment forms with encryption badges

### Immersive Experiences
- **VR/AR Viewers**: Venue exploration with luxury frames
- **360° Galleries**: Photo and video galleries with glass overlays
- **Interactive Planning**: Seating charts, cake decorators, timeline builders

## MCP Tools Integration

### Available MCP Servers
The project includes comprehensive MCP (Model Context Protocol) integration for enhanced capabilities:

#### 🗂️ **Filesystem Operations**
- **Server**: `@modelcontextprotocol/server-filesystem`
- **Use Cases**: Advanced file operations, cross-directory management
- **Agent Usage**: File system operations beyond standard tools

#### 🌐 **Web Fetching**
- **Server**: `mcp-server-fetch` (uvx)
- **Use Cases**: API calls, web scraping, external resource fetching
- **Agent Usage**: Enhanced web requests with custom headers

#### 🐙 **GitHub Integration**
- **Server**: `@modelcontextprotocol/server-github`
- **Use Cases**: Repository management, issue tracking, PR automation
- **Agent Usage**: Advanced Git operations and repository analysis

#### 🎭 **Browser Automation**
- **Server**: `@playwright/mcp`
- **Use Cases**: UI testing, web automation, screenshot generation
- **Agent Usage**: Component testing and validation

#### 🧠 **Memory Management**
- **Server**: `@modelcontextprotocol/server-memory`
- **Use Cases**: Persistent context, cross-session data storage
- **Agent Usage**: Maintaining component generation history

#### 🔍 **Web Search**
- **Server**: `@modelcontextprotocol/server-brave-search`
- **Use Cases**: Real-time research, current information retrieval
- **Agent Usage**: Design inspiration and trend research

#### 🏗️ **Database Operations**
- **Server**: `@supabase/mcp-server-supabase`
- **Use Cases**: Database management, real-time subscriptions
- **Agent Usage**: Wedding data management and analytics

#### 🎨 **UI Component Generation**
- **Server**: `@modelcontextprotocol/server-shadcn-ui`
- **Use Cases**: Component generation, design system integration
- **Agent Usage**: Rapid component prototyping

#### 🎯 **AI Image Generation**
- **Server**: `@modelcontextprotocol/server-ideogram`
- **Use Cases**: Visual content creation, design assets
- **Agent Usage**: Wedding-themed illustrations and graphics

### E2B Sandbox Integration

#### 🧪 **Isolated Testing Environment**
- **Purpose**: Component testing and validation in secure sandboxes
- **Capabilities**:
  - Real-time code execution
  - Component rendering and testing
  - Build system integration
  - Interactive development
  - Live component demos

#### **Agent E2B Workflow**
```javascript
// Agent workflow with E2B integration
1. Generate component using MCP tools
2. Deploy to E2B sandbox for testing
3. Validate component behavior and styling
4. Iterate based on test results
5. Commit validated components
```

#### **E2B Use Cases**
- **Component Testing**: Isolated testing of new Nuptily components
- **Build Verification**: Ensuring components build correctly
- **Interactive Demos**: Creating live examples for validation
- **Performance Testing**: Analyzing component performance metrics
- **Integration Testing**: Testing component interactions

### MCP Usage Guidelines for Agents

#### **When Agents Should Use MCP Tools**
- **Filesystem MCP**: For complex file operations across directories
- **GitHub MCP**: For repository analysis and automation
- **Playwright MCP**: For component testing and UI validation
- **Memory MCP**: For maintaining context across iterations
- **Supabase MCP**: For database operations and real-time features
- **ShadCN MCP**: For rapid component generation
- **E2B Sandbox**: For secure component testing and validation

#### **SuperClaude Command Integration**
```bash
# Agents can leverage all MCP tools during infinite generation
/project:infinite specs/nuptily_design_system_v2_comprehensive.md src/stories/2-Components 5

# Available capabilities:
# - MCP filesystem operations
# - GitHub repository management  
# - E2B sandbox testing
# - Memory persistence
# - Real-time web search
# - Database operations
# - Component generation
```

## Common Commands

### Nuptily Design System Generation
```bash
# Generate 3 luxury wedding components (comprehensive spec)
/project:infinite specs/nuptily_design_system_v2_comprehensive.md src/stories/2-Components 3

# Generate 5 components with existing Nuptily spec
/project:infinite specs/nuptily-design-system.md src/stories/2-Components 5

# Generate 10 components with full design system integration
/project:infinite specs/nuptily_design_system_v2_comprehensive.md src/stories/2-Components 10

# Infinite generation mode for continuous component creation
/project:infinite specs/nuptily_design_system_v2_comprehensive.md src/stories/2-Components infinite
```

### Component Categories Available
- **Foundation**: LuxuryButton, GlassCard, NeumorphicInput, AuroraBackground
- **Navigation**: LuxuryNavigation, WeddingBreadcrumbs, TabSystem, FloatingActionButton
- **Data Display**: VendorCard, TimelineComponent, GuestList, BudgetTracker
- **Feedback**: LuxuryToast, ProgressIndicator, LoadingSpinner, SuccessParticles
- **Forms**: WeddingDatePicker, VenueSelector, GuestInviter, PaymentForm
- **AI Components**: ConversationalInterface, VoiceVisualizer, SmartSuggestions, AvatarContainer
- **Communication**: InstantMessenger, VideoCallInterface, MediaUploader, TypingIndicator

### Instant Messenger Usage
```javascript
// Open Instant Messenger from any component
import { openMessenger } from '@/utils/messengerUtils';

// Open in center mode (default for main actions)
openMessenger({ center: true });

// Start a video call directly
import { startVideoCall } from '@/utils/messengerUtils';
startVideoCall('chat-id');

// Start an audio call
import { startAudioCall } from '@/utils/messengerUtils';
startAudioCall('chat-id');

// Open in corner mode (minimized)
openMessenger({ center: false, minimized: true });
```

### Development Workflow
1. Create or modify specification in `specs/`
2. Run infinite command with desired count
3. Review generated components in Storybook
4. Test components in E2B sandbox
5. Validate design system compliance
6. Iterate on specification based on results

## Best Practices

### Design System Compliance
- Every component must implement the three-layer architecture
- Use NuptilyCoreProps interface for consistency
- Maintain luxury wedding planning aesthetic
- Include comprehensive Storybook stories

### Performance Optimization
- Implement adaptive rendering (lite/balanced/full)
- Optimize for mobile with reduced effects
- Respect accessibility preferences
- Use progressive enhancement

### Wedding Context
- Components should feel appropriate for life's most important moments
- Use romantic and celebratory design elements
- Consider couple workflows and guest experiences
- Maintain elegance and sophistication

### MCP Integration Best Practices
- Use appropriate MCP server for each task
- Leverage E2B sandboxes for component testing
- Maintain persistent context with Memory MCP
- Combine MCP tools efficiently for complex workflows

## Design System Validation

Each generated component will include:
- ✅ Three-layer architecture (Aurora + Glass + Neumorphic)
- ✅ NuptilyCoreProps interface implementation
- ✅ Comprehensive Storybook stories with controls
- ✅ Responsive design with performance optimization
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Wedding-specific functionality and aesthetics
- ✅ E2B sandbox testing validation
- ✅ MCP tool integration where appropriate

## Troubleshooting

### Common Issues
1. **Missing Design Layers**: Ensure all three layers (Aurora, Glass, Neumorphic) are implemented
2. **Performance Issues**: Use appropriate performance level (lite for mobile)
3. **Accessibility Problems**: Test with screen readers and keyboard navigation
4. **Wedding Context**: Ensure components feel appropriate for luxury wedding planning
5. **MCP Connectivity**: Verify MCP servers are running and accessible
6. **E2B Sandbox**: Check sandbox availability and resource limits

### Debug Commands
```bash
# Check current component count
ls -la src/stories/2-Components/*.stories.tsx | wc -l

# Review latest components
ls -la src/stories/2-Components/ | tail -10

# Clear components directory
rm -rf src/stories/2-Components/*

# Test MCP connectivity
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | npx -y @modelcontextprotocol/server-filesystem /tmp
```

## Extension Ideas
- Add wedding theme variations (rustic, modern, vintage)
- Implement seasonal color palettes
- Create venue-specific component sets
- Build cultural wedding tradition components
- Add accessibility enhancements for diverse needs
- Integrate more MCP servers for enhanced capabilities
- Expand E2B sandbox testing scenarios

## Quick Reference

### Core Props Interface
```typescript
interface NuptilyCoreProps {
  variant: 'glass' | 'neumorphic' | 'hybrid';
  auroraIntensity: 'none' | 'subtle' | 'medium' | 'intense';
  elevation: 'flat' | 'raised' | 'sunken' | 'hovering' | 'floating';
  theme: 'light' | 'dark' | 'auto';
  interactive: boolean;
  goldAccent: boolean;
  performanceLevel: 'lite' | 'balanced' | 'full';
}
```

### Design Tokens
```scss
// Aurora Gradients
--aurora-luxury: linear-gradient(135deg, #FFD700 0%, rgba(255, 215, 0, 0.3) 25%, rgba(0, 33, 71, 0.2) 50%, #002147 100%);

// Glass Materials
--glass-crystal: rgba(255, 255, 255, 0.2);
--glass-gold: rgba(255, 215, 0, 0.1);

// Neumorphic Shadows
--shadow-neu-raised: 6px 6px 12px rgba(0, 33, 71, 0.15), -6px -6px 12px rgba(255, 255, 255, 0.7);
```

## Available Specifications

1. **nuptily_design_system_v2_comprehensive.md** - Complete design system with detailed implementation
2. **nuptily-design-system.md** - Existing Storybook-focused specification
3. **example_ui_generation.md** - General UI components (non-Nuptily)
4. **content_generation.md** - Content generation specification

## MCP Tools Reference

For detailed MCP tools documentation, see: `docs/MCP_TOOLS_REFERENCE.md`

The system is now ready to generate luxury wedding planning components that embody the "Luxury Through Layered Elegance" philosophy with full MCP integration and E2B sandbox testing capabilities!