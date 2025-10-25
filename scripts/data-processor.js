class DataProcessor {
    constructor() {
    this.data = null;
    this.loadSampleData();
    }
    async loadSampleData() {
    try {
    const response = await fetch('data/sample-data.json');
    this.data = await response.json();
    console.log('Sample data loaded successfully');
    } catch (error) {
    console.error('Error loading sample data:', error);
    this.generateFallbackData();
    }
    }
    generateFallbackData() {
    // Fallback data in case JSON file fails to load
    this.data = {
    revenue: {
    monthly: [
    {month: "Jan", value: 185000, growth: 8.2},
    {month: "Feb", value: 198000, growth: 7.0},
    {month: "Mar", value: 215000, growth: 8.6},
    {month: "Apr", value: 232000, growth: 7.9},
    {month: "May", value: 248000, growth: 6.9},
    {month: "Jun", value: 267000, growth: 7.7}
    ]
    },
    products: [
    {name: "Premium Analytics", revenue: 450000, units: 1200, growth: 15.3},
    {name: "Basic Dashboard", revenue: 320000, units: 2400, growth: 8.7},
    {name: "Enterprise Suite", revenue: 580000, units: 145, growth: 22.1},
    {name: "Mobile App", revenue: 180000, units: 3600, growth: -2.3}
    ]
    };
    }
    // Query processing methods
    processQuery(query) {
    const queryLower = query.toLowerCase();
    // Determine query type and extract relevant data
    if (queryLower.includes('revenue') || queryLower.includes('sales')) {
    return this.analyzeRevenue(query);
    } else if (queryLower.includes('product') || queryLower.includes('performance')) {
    return this.analyzeProducts(query);
    } else if (queryLower.includes('customer') || queryLower.includes('satisfaction')) {
    return this.analyzeCustomers(query);
    } else if (queryLower.includes('region') || queryLower.includes('geographic')) {
    return this.analyzeRegions(query);
    } else if (queryLower.includes('trend') || queryLower.includes('growth')) {
    return this.analyzeTrends(query);
    } else {
    return this.generateGeneralInsights(query);
    }
    }
    analyzeRevenue(query) {
    if (!this.data?.revenue) return null;
    const totalRevenue = this.data.revenue.monthly.reduce((sum, month) => sum +
    month.value, 0);
    const avgGrowth = this.data.revenue.monthly.reduce((sum, month) => sum +
    month.growth, 0) / this.data.revenue.monthly.length;
    return {
    type: 'revenue',
    summary: `Total revenue: $${this.formatCurrency(totalRevenue)}`,
    insights: [
    `Average monthly growth rate: ${avgGrowth.toFixed(1)}%`,
    `Strongest month: ${this.getBestMonth().month}
    ($${this.formatCurrency(this.getBestMonth().value)})`,
    `Revenue trend: ${avgGrowth > 5 ? 'Strong upward trajectory' : 'Moderate growth'}`
    ],
    data: this.data.revenue.monthly,
    chartType: 'line'
    };
    }
    analyzeProducts(query) {
    if (!this.data?.products) return null;
    const topProduct = this.data.products.reduce((max, product) =>
    product.revenue > max.revenue ? product : max
    );
    const growingProducts = this.data.products.filter(p => p.growth > 0);
    return {
    type: 'products',
    summary: `Top performer: ${topProduct.name}
    ($${this.formatCurrency(topProduct.revenue)})`,
    insights: [
    `${growingProducts.length} out of ${this.data.products.length} products
    showing positive growth`,
    `Highest growth rate: ${Math.max(...this.data.products.map(p =>
    p.growth))}%`,
    `Total product revenue:
    $${this.formatCurrency(this.data.products.reduce((sum, p) => sum + p.revenue, 0))}`
    ],
    data: this.data.products,
    chartType: 'bar'
    };
    }
    analyzeCustomers(query) {
    if (!this.data?.customers) return null;
    return {
    type: 'customers',
    summary: `${this.data.customers.total.toLocaleString()} total customers with
    ${this.data.customers.satisfaction}/5 satisfaction`,
    insights: [
    `Monthly new customers:
    ${this.data.customers.new_monthly.toLocaleString()}`,
    `Churn rate: ${this.data.customers.churn_rate}% (industry average: 5-7%)`,
    `Enterprise segment has highest satisfaction:
    ${this.data.customers.segments[0].satisfaction}/5`
    ],
    data: this.data.customers.segments,
    chartType: 'doughnut'
    };
    }
    analyzeRegions(query) {
    if (!this.data?.regions) return null;
    const topRegion = this.data.regions.reduce((max, region) =>
    region.revenue > max.revenue ? region : max
    );
    return {
    type: 'regions',
    summary: `${topRegion.name} leads with
    $${this.formatCurrency(topRegion.revenue)} revenue`,
    insights: [
    `Fastest growing region: Asia Pacific (${this.data.regions.find(r => r.name ===
    'Asia Pacific').growth}%)`,
    `Total global customers: ${this.data.regions.reduce((sum, r) => sum +
    r.customers, 0).toLocaleString()}`,
    `Average regional growth: ${(this.data.regions.reduce((sum, r) => sum +
    r.growth, 0) / this.data.regions.length).toFixed(1)}%`
    ],
    data: this.data.regions,
    chartType: 'bar'
    };
    }
    analyzeTrends(query) {
    if (!this.data?.trends) return null;
    return {
    type: 'trends',
    summary: 'Key business trends and opportunities identified',
    insights: [
    `Growing segments: ${this.data.trends.top_growing_segments.join(', ')}`,
    `Areas of concern: ${this.data.trends.concerning_trends.join(', ')}`,
    `Key opportunities: ${this.data.trends.opportunities.join(', ')}`
    ],
    data: this.data.trends,
    chartType: 'radar'
    };
    }
    generateGeneralInsights(query) {
    return {
    type: 'general',
    summary: 'Comprehensive business overview',
    insights: [
    'Revenue is growing consistently across all quarters',
    'Customer satisfaction remains high at 4.7/5',
    'Enterprise segment shows strongest growth potential',
    'Geographic expansion opportunities in Asia Pacific'
    ],
    data: null,
    chartType: 'mixed'
    };
    }
    // Utility methods
    getBestMonth() {
    return this.data.revenue.monthly.reduce((max, month) =>
    month.value > max.value ? month : max
    );
    }
    formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
    }).format(amount);
    }
    calculateGrowthRate(current, previous) {
    return ((current - previous) / previous * 100).toFixed(1);
    }
    // Advanced analytics methods
    detectAnomalies(dataset) {
    // Simple anomaly detection based on standard deviation
    const values = dataset.map(item => item.value || item.revenue || 0);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean,
    2), 0) / values.length);
    return dataset.filter((item, index) => {
    const value = values[index];
    return Math.abs(value - mean) > 2 * stdDev;
    });
    }
    predictNextPeriod(dataset) {
    // Simple linear regression for prediction
    const values = dataset.map(item => item.value || item.revenue || 0);
    const n = values.length;
    const x = Array.from({length: n}, (_, i) => i + 1);
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * values[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return slope * (n + 1) + intercept;
    }
    generateRecommendations(analysisResult) {
    const recommendations = [];
    switch(analysisResult.type) {
    case 'revenue':
    if (analysisResult.data.some(month => month.growth < 5)) {
    recommendations.push('Consider marketing campaigns for months with lower growth');
    }
    recommendations.push('Focus on high-performing months for scaling strategies');
    break;
    case 'products':
    const decliningProducts = analysisResult.data.filter(p => p.growth < 0);
    if (decliningProducts.length > 0) {
    recommendations.push(`Review strategy for declining products:
    ${decliningProducts.map(p => p.name).join(', ')}`);
    }
    break;
    case 'customers':
    if (analysisResult.data.find(s => s.name === 'Enterprise')?.satisfaction > 4.8) {
    recommendations.push('Leverage high Enterprise satisfaction for case studies and referrals');
    }
    break;
    }
    return recommendations;
    }
    }
    // Initialize data processor
    const dataProcessor = new DataProcessor();