import { ChatMessage, Artifact } from '@/types';

export const generateStreamingResponse = async function* (prompt: string): AsyncGenerator<string, void, unknown> {
  // Simple greetings and casual responses
  if (prompt.toLowerCase().match(/^(hi|hello|hey|good morning|good afternoon|good evening)$/i)) {
    const responses = [
      "Hello! How can I help you today?",
      "Hi there! What would you like to know?",
      "Hey! I'm here to help. What's on your mind?",
      "Hello! I'm ready to assist you with any questions you have."
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    for (const word of response.split(' ')) {
      yield word + ' ';
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 50));
    }
    return;
  }

  // Search-related queries
  if (prompt.toLowerCase().includes('search result') || prompt.toLowerCase().includes('search for')) {
    const searchTerm = prompt.replace(/search result for|search for/gi, '').replace(/"/g, '').trim();
    const response = `I found some information about "${searchTerm}":

**Quick Overview:**
This appears to be a search query. Let me help you find what you're looking for.

**What I can help with:**
- Explain concepts related to "${searchTerm}"
- Provide examples and use cases
- Answer specific questions about the topic
- Help you dive deeper into any particular aspect

**Next Steps:**
Could you be more specific about what you'd like to know about "${searchTerm}"? For example:
- Are you looking for a definition or explanation?
- Do you need practical examples?
- Are you trying to solve a specific problem?

I'm here to help you get the exact information you need!`;

    const words = response.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      yield words[i] + (i < words.length - 1 ? ' ' : '');
      await new Promise(resolve => setTimeout(resolve, 60 + Math.random() * 80));
    }
    return;
  }

  // Technical questions get detailed responses
  if (prompt.toLowerCase().includes('react') || prompt.toLowerCase().includes('javascript') || prompt.toLowerCase().includes('typescript') || prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('programming') || prompt.toLowerCase().includes('development')) {
    const mockResponse = `Here's a comprehensive explanation of ${prompt}:

**Key Concepts:**

1. **Fundamentals**: Understanding the core principles and how they work together
2. **Implementation**: Practical steps to implement this in real-world scenarios
3. **Best Practices**: Industry standards and recommended approaches
4. **Common Pitfalls**: Things to avoid and how to troubleshoot issues

\`\`\`typescript
// Example implementation
interface Example {
  id: string;
  name: string;
  value: number;
}

const example: Example = {
  id: "1",
  name: "Example",
  value: 42
};
\`\`\`

**Additional Resources:**
- Documentation links
- Tutorial videos
- Community discussions

This should give you a solid foundation to work with!`;

    const words = mockResponse.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      yield words[i] + (i < words.length - 1 ? ' ' : '');
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
    return;
  }

  // Questions about specific topics
  if (prompt.toLowerCase().includes('what is') || prompt.toLowerCase().includes('how does') || prompt.toLowerCase().includes('explain')) {
    const topic = prompt.replace(/what is|how does|explain/gi, '').trim();
    const response = `Great question about "${topic}"!

**What it is:**
This is a fascinating topic that many people are curious about. Let me break it down for you in simple terms.

**Key Points:**
- **Definition**: A clear explanation of what "${topic}" means
- **How it works**: The basic mechanics and principles
- **Why it matters**: The importance and real-world applications
- **Examples**: Practical instances you can relate to

**Real-world applications:**
- How it's used in everyday life
- Industries that rely on it
- Common use cases and scenarios

**Getting started:**
If you want to learn more about "${topic}", I'd recommend starting with the basics and then exploring specific areas that interest you most.

Would you like me to dive deeper into any particular aspect of "${topic}"?`;

    const words = response.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      yield words[i] + (i < words.length - 1 ? ' ' : '');
      await new Promise(resolve => setTimeout(resolve, 70 + Math.random() * 60));
    }
    return;
  }

  // General questions get helpful responses
  const generalResponse = `I'd be happy to help you with "${prompt}"!

**Let me understand what you're looking for:**
This seems like an interesting topic. To give you the most helpful response, let me break this down:

**What I can help with:**
- **Explanations**: Clear, easy-to-understand explanations
- **Examples**: Practical examples and use cases
- **Step-by-step guides**: If you need to do something specific
- **Resources**: Links to helpful materials and documentation

**To give you the best answer:**
Could you tell me a bit more about:
- What specifically you'd like to know?
- What's your current level of experience with this topic?
- Are you looking for a quick overview or detailed information?

**I'm here to help!**
Feel free to ask follow-up questions or let me know if you'd like me to focus on a particular aspect.`;

  const words = generalResponse.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? ' ' : '');
    await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 70));
  }
};

export const generateArtifacts = (content: string): Artifact[] => {
  const artifacts: Artifact[] = [];
  
  // Extract code blocks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  let codeIndex = 0;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    artifacts.push({
      id: `code-${codeIndex}`,
      type: 'code',
      title: `Code Block ${codeIndex + 1}`,
      content: match[2],
      language: match[1] || 'text',
      isExpanded: false
    });
    codeIndex++;
  }
  
  return artifacts;
};

export const mockSearchResults = async (query: string): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: '1',
      title: `Search result for "${query}"`,
      content: `This is a mock search result containing information about ${query}`,
      type: 'conversation',
      timestamp: new Date()
    },
    {
      id: '2', 
      title: `Another result about ${query}`,
      content: `Additional information and context about ${query}`,
      type: 'message',
      timestamp: new Date()
    }
  ];
};

export const mockPeopleSearch = async (query: string): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const people = [
    { id: '1', name: 'John Doe', role: 'Software Engineer' },
    { id: '2', name: 'Jane Smith', role: 'Product Manager' },
    { id: '3', name: 'Mike Johnson', role: 'Designer' },
    { id: '4', name: 'Sarah Wilson', role: 'Data Scientist' },
    { id: '5', name: 'Alex Brown', role: 'DevOps Engineer' }
  ];
  
  return people.filter(person => 
    person.name.toLowerCase().includes(query.toLowerCase())
  );
};
