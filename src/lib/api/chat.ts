import { ChatMessage, Artifact } from '@/types';

export const generateStreamingResponse = async function* (prompt: string): AsyncGenerator<string, void, unknown> {
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
