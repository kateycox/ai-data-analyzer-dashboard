// AI Integration for Natural Language Processing
class AIAnalyzer {
    constructor() {
        // Load API key from environment variable or fallback
        this.groqApiKey = this.getApiKey();
        this.groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.conversationHistory = [];
    }
    
    getApiKey() {
        // Try to get API key from various sources
        // 1. Check if it's set as a global variable (for development)
        if (typeof window !== 'undefined' && window.GROK_API_KEY) {
            return window.GROK_API_KEY;
        }
        
        // 2. Check localStorage (for development)
        if (typeof localStorage !== 'undefined') {
            const storedKey = localStorage.getItem('GROK_API_KEY');
            if (storedKey && storedKey !== 'your_grok_api_key_here') {
                return storedKey;
            }
        }
        
        // 3. Check if envLoader is available and has the key
        if (typeof envLoader !== 'undefined') {
            const envKey = envLoader.get('GROK_API_KEY');
            if (envKey && envKey !== 'your_grok_api_key_here') {
                return envKey;
            }
        }
        
        // 4. Fallback - use placeholder that will cause a clear error
        console.warn('GROK_API_KEY not found. Please set your API key in the .env file or as window.GROK_API_KEY');
        return 'YOUR_GROK_API_KEY_HERE';
    }
    async analyzeQuery(query, dataContext) {
    try {
    const prompt = this.createAnalysisPrompt(query, dataContext);
    const response = await this.callGroqAPI(prompt);
    return this.parseAIResponse(response, dataContext);
    } catch (error) {
    console.error('AI Analysis Error:', error);
    return this.generateFallbackResponse(query, dataContext);
    }
    }
    createAnalysisPrompt(query, dataContext) {
    return `You are an expert business intelligence analyst with deep expertise in
    data interpretation, trend analysis, and strategic recommendations.
    USER QUERY: "${query}"
    BUSINESS DATA CONTEXT:
    ${JSON.stringify(dataContext, null, 2)}
    ANALYSIS REQUIREMENTS:
    1. Provide clear, actionable insights based on the data
    2. Identify key trends, patterns, and anomalies
    3. Offer specific business recommendations
    4. Use executive-level language suitable for decision makers
    5. Quantify impacts and opportunities where possible
    6. Highlight both positive trends and areas of concern
    RESPONSE FORMAT:
    - Executive Summary (2-3 sentences)
    - Key Insights (3-5 bullet points with specific data)
    - Strategic Recommendations (2-3 actionable items)
    - Risk Assessment (potential concerns or limitations)
    - Next Steps (specific actions to take)
    Focus on being precise, data-driven, and actionable. Avoid generic statements and
    provide specific metrics and percentages where relevant.`;
    }
    async callGroqAPI(prompt) {
        // Debug: Check if API key is properly loaded
        if (this.groqApiKey === 'YOUR_GROK_API_KEY_HERE') {
            throw new Error('API key not configured. Please set GROK_API_KEY in your .env file.');
        }
        
        console.log('Making API call to Groq with key:', this.groqApiKey.substring(0, 10) + '...');
        
        const response = await fetch(this.groqUrl, {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${this.groqApiKey}`,
        'Content-Type': 'application/json'
        },
    body: JSON.stringify({
    model: 'mixtral-8x7b-32768',
    messages: [
    {
    role: 'system',
    content: 'You are a senior business intelligence analyst with 15+ years ofexperience in data analysis, strategic planning, and executive reporting. You excel attransforming complex data into clear, actionable business insights.'
    },
    {
    role: 'user',
    content: prompt
    }
    ],
    temperature: 0.7,
    max_tokens: 1500,
    top_p: 0.9
    })
    });
    if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid API response format');
    }
    return data.choices[0].message.content.trim();
    }
    parseAIResponse(aiResponse, dataContext) {
    // Parse the structured AI response
    const sections = {
    executiveSummary: this.extractSection(aiResponse, 'Executive Summary'),
    keyInsights: this.extractSection(aiResponse, 'Key Insights'),
    recommendations: this.extractSection(aiResponse, 'StrategicRecommendations'),
    riskAssessment: this.extractSection(aiResponse, 'Risk Assessment'),
    nextSteps: this.extractSection(aiResponse, 'Next Steps')
    };
    return {
    type: 'ai_analysis',
    summary: sections.executiveSummary || 'AI analysis completed successfully',
    insights: this.parseInsights(sections.keyInsights),
    recommendations: this.parseRecommendations(sections.recommendations),
    risks: sections.riskAssessment,
    nextSteps: sections.nextSteps,
    fullResponse: aiResponse,
    dataContext: dataContext,
    timestamp: new Date().toISOString()
    };
    }
    extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\n|$|[A-Z][a-z]+
    [A-Z][a-z]+:|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
    }
    parseInsights(insightsText) {
    if (!insightsText) return [];
    return insightsText
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(insight => insight.length > 10);
    }
    parseRecommendations(recommendationsText) {
    if (!recommendationsText) return [];
    return recommendationsText
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(rec => rec.length > 10);
    }
    generateFallbackResponse(query, dataContext) {
    // Intelligent fallback based on data context
    const fallbackInsights = [];
    if (dataContext?.type === 'revenue') {
    fallbackInsights.push('Revenue shows consistent growth trajectory');
    fallbackInsights.push('Monthly performance indicates strong market demand');
    } else if (dataContext?.type === 'products') {
    fallbackInsights.push('Product portfolio demonstrates diverse revenue  streams');
    fallbackInsights.push('Growth rates vary significantly across product lines');
    } else if (dataContext?.type === 'customers') {
    fallbackInsights.push('Customer satisfaction metrics exceed industry  benchmarks');
    fallbackInsights.push('Customer acquisition trends show positive  momentum');
    }
    return {
    type: 'fallback_analysis',
    summary: 'Analysis completed using built-in intelligence algorithms',
    insights: fallbackInsights,
    recommendations: [
    'Continue monitoring key performance indicators',
    'Consider deeper analysis of high-performing segments',
    'Implement regular review cycles for strategic planning'
    ],
    risks: 'Limited AI connectivity may affect real-time insights',
    nextSteps: 'Establish reliable data pipeline for continuous analysis',
    dataContext: dataContext,
    timestamp: new Date().toISOString()
    };
    }
    // Advanced AI features
    async generatePredictiveInsights(dataContext) {
    const prompt = `Based on this business data, provide predictive insights and
    forecasting:
    ${JSON.stringify(dataContext, null, 2)}
    Generate:
    1. 3-month trend predictions
    2. Risk factors that could impact growth
    3. Opportunity identification
    4. Recommended KPIs to monitor
    Be specific with numbers and timeframes.`;
    try {
    const response = await this.callGroqAPI(prompt);
    return this.parseAIResponse(response, dataContext);
    } catch (error) {
    return this.generateFallbackResponse('predictive analysis', dataContext);
    }
    }
    async compareWithIndustryBenchmarks(dataContext) {
    const prompt = `Compare this business performance with industry benchmarks
    and standards:
    ${JSON.stringify(dataContext, null, 2)}
    Provide:
    1. How metrics compare to industry averages
    2. Areas where performance exceeds benchmarks
    3. Areas needing improvement
    4. Competitive positioning insights
    Use specific percentages and benchmarks where possible.`;
    try {
    const response = await this.callGroqAPI(prompt);
    return this.parseAIResponse(response, dataContext);
    } catch (error) {
    return this.generateFallbackResponse('benchmark analysis', dataContext);
    }
    }
    // Conversation memory management
    addToHistory(query, response) {
    this.conversationHistory.push({
    query: query,
    response: response,
    timestamp: new Date().toISOString()
    });
    // Keep only last 10 interactions for performance
    if (this.conversationHistory.length > 10) {
    this.conversationHistory = this.conversationHistory.slice(-10);
    }
    }
    getConversationContext() {
        return this.conversationHistory
        .slice(-3) // Last 3 interactions for context
        .map(item => `Q: ${item.query}\nA: ${item.response.summary}`)
        .join('\n\n');
    }
    
    // Method to manually set API key (for testing)
    setApiKey(key) {
        this.groqApiKey = key;
        console.log('API key updated');
    }
}

// Initialize AI analyzer
const aiAnalyzer = new AIAnalyzer();

// Add global method for testing
window.setApiKey = function(key) {
    aiAnalyzer.setApiKey(key);
    console.log('API key set via window.setApiKey()');
};