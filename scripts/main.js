// Main Application Controller
class BusinessIntelligenceDashboard {
    constructor() {
    this.currentChart = null;
    this.isAnalyzing = false;
    this.initializeApp();
    }
    initializeApp() {
    this.setupEventListeners();
    this.initializeChart();
    this.updateMetrics();
    console.log('AI Business Intelligence Dashboard initialized');
    }
    setupEventListeners() {
    // Query input and analysis
    const queryInput = document.getElementById('queryInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.addEventListener('click', () => this.handleAnalysis());
    queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    this.handleAnalysis();
    }
    });
    // Quick query buttons
    document.querySelectorAll('.quick-query-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
    const query = e.target.dataset.query;
    queryInput.value = query;
    this.handleAnalysis();
    });
    });
    // Chart controls
    document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
    document.querySelectorAll('.chart-btn').forEach(b =>
    b.classList.remove('active'));
    e.target.classList.add('active');
    this.updateChart(e.target.dataset.chart);
    });
    });
    }
    async handleAnalysis() {
    if (this.isAnalyzing) return;
    const query = document.getElementById('queryInput').value.trim();
    if (!query) {
    this.showNotification('Please enter a question to analyze', 'warning');
    return;
    }
    this.isAnalyzing = true;
    this.showLoadingState();
    try {
    // Process query with data processor
    const dataContext = dataProcessor.processQuery(query);
    // Get AI insights
    const aiAnalysis = await aiAnalyzer.analyzeQuery(query, dataContext);
    // Display results
    this.displayAnalysisResults(aiAnalysis, dataContext);
    // Add to conversation history
    aiAnalyzer.addToHistory(query, aiAnalysis);
    // Update chart if relevant
    if (dataContext && dataContext.chartType) {
    this.updateChartWithData(dataContext);
    }
    } catch (error) {
    console.error('Analysis error:', error);
    this.showErrorState('Analysis failed. Please try again.');
    } finally {
    this.isAnalyzing = false;
    this.hideLoadingState();
    }
    }
    displayAnalysisResults(aiAnalysis, dataContext) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultHTML = `
    <div class="analysis-result">
    <div class="analysis-header">
    <h3>🧠 AI Analysis Results</h3>
    <span class="analysis-timestamp">${new
    Date().toLocaleTimeString()}</span>
    </div>
    <div class="analysis-content">
    <div class="executive-summary">
    <h4>Executive Summary</h4>
    <p>${aiAnalysis.summary}</p>
    </div>
    ${aiAnalysis.insights && aiAnalysis.insights.length > 0 ? `
    <div class="key-insights">
    <h4>Key Insights</h4>
    <ul>
    ${aiAnalysis.insights.map(insight => `<li>${insight}</li>`).join('')}
    </ul>
    </div>
    ` : ''}
    ${aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0
    ? `
    <div class="recommendations">
    <h4>Strategic Recommendations</h4>
    <ul>
    ${aiAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
    </div>
    ` : ''}
    ${aiAnalysis.risks ? `
    <div class="insight-highlight">
    <h4>Risk Assessment</h4>
    <p>${aiAnalysis.risks}</p>
    </div>
    ` : ''}
    ${aiAnalysis.nextSteps ? `
    <div class="next-steps">
    <h4>Recommended Next Steps</h4>
    <p>${aiAnalysis.nextSteps}</p>
    </div>
    ` : ''}
    ${dataContext && dataContext.data ? `
    <div class="data-summary">
    <h4>Data Summary</h4>
    ${this.generateDataTable(dataContext)}
    </div>
    ` : ''}
    </div>
    <div class="analysis-actions">
    <button onclick="dashboard.exportAnalysis()" class="action-btn">📊 Export
    Report</button>
    <button onclick="dashboard.shareAnalysis()" class="action-btn">🔗 Share
    Insights</button>
    <button onclick="dashboard.scheduleFollowUp()" class="action-btn">📅
    Schedule Follow-up</button>
    </div>
    </div>
    `;
    resultsContainer.innerHTML = resultHTML;
    }
    generateDataTable(dataContext) {
    if (!dataContext.data || !Array.isArray(dataContext.data)) {
    return '<p>No tabular data available for this analysis.</p>';
    }
    const data = dataContext.data.slice(0, 10); // Limit to 10 rows
    if (data.length === 0) return '<p>No data to display.</p>';
    const headers = Object.keys(data[0]);
    return `
    <table class="data-table">
    <thead>
    <tr>
    ${headers.map(header =>
    `<th>${this.formatHeader(header)}</th>`).join('')}
    </tr>
    </thead>
    <tbody>
    ${data.map(row => `
    <tr>
    ${headers.map(header => `<td>${this.formatCellValue(row[header],
    header)}</td>`).join('')}
    </tr>
    `).join('')}
    </tbody>
    </table>
    `;
    }
    formatHeader(header) {
    return header.replace(/_ /g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    formatCellValue(value, header) {
    if (typeof value === 'number') {
    if (header.includes('revenue') || header.includes('value')) {
    return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
    }).format(value);
    } else if (header.includes('growth') || header.includes('rate')) {
    return `${value}%`;
    } else {
    return value.toLocaleString();
    }
    }
    return value;
    }
    initializeChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    this.currentChart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
    label: 'Monthly Revenue',
    data: [185000, 198000, 215000, 232000, 248000, 267000],
    borderColor: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderWidth: 3,
    fill: true,
    tension: 0.4
    }]
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
    legend: {
    display: true,
    position: 'top'
    },
    title: {
    display: true,
    text: 'Revenue Trends'
    }
    },
    scales: {
    y: {
    beginAtZero: false,
    ticks: {
    callback: function(value) {
    return '$' + (value / 1000) + 'K';
    }
    }
    }
    }
    }
    });
    }
    updateChart(chartType) {
    if (!this.currentChart) return;
    const chartConfigs = {
    revenue: {
    type: 'line',
    data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
    label: 'Monthly Revenue',
    data: [185000, 198000, 215000, 232000, 248000, 267000],
    borderColor: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    fill: true
    }]
    },
    title: 'Revenue Trends'
    },
    products: {
    type: 'bar',
    data: {
    labels: ['Premium Analytics', 'Basic Dashboard', 'Enterprise Suite', 'Mobile App'],
    datasets: [{
    label: 'Product Revenue',
    data: [450000, 320000, 580000, 180000],
    backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
    }]
    },
    title: 'Product Performance'
    },
    customers: {
    type: 'doughnut',
    data: {
    labels: ['Enterprise', 'Mid-Market', 'Small Business'],
    datasets: [{
    data: [145, 1200, 14502],
    backgroundColor: ['#667eea', '#764ba2', '#f093fb']
    }]
    },
    title: 'Customer Segments'
    },
    regions: {
    type: 'bar',
    data: {
    labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America'],
    datasets: [{
    label: 'Regional Revenue',
    data: [756000, 432000, 287000, 125000],
    backgroundColor: '#667eea'
    }]
    },
    title: 'Regional Performance'
    }
    };
    const config = chartConfigs[chartType];
    if (!config) return;
    this.currentChart.destroy();
    const ctx = document.getElementById('mainChart').getContext('2d');
    this.currentChart = new Chart(ctx, {
    type: config.type,
    data: config.data,
    options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
    title: {
    display: true,
    text: config.title
    }
    }
    }
    });
    }
    updateChartWithData(dataContext) {
    if (!dataContext.data || !this.currentChart) return;
    // Update chart based on data context type
    this.updateChart(dataContext.type);
    }
    updateMetrics() {
    // Update the metrics cards with current data
    const metrics = {
    totalRevenue: '$2.4M',
    activeCustomers: '15,847',
    avgOrderValue: '$156',
    customerSat: '4.7/5'
    };
    Object.entries(metrics).forEach(([key, value]) => {
    const element = document.getElementById(key);
    if (element) {
    element.textContent = value;
    }
    });
    }
    // Loading states
    showLoadingState() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
    // Animate loading steps
    const steps = ['step1', 'step2', 'step3'];
    let currentStep = 0;
    const stepInterval = setInterval(() => {
    if (currentStep > 0) {
    document.getElementById(steps[currentStep - 1]).classList.remove('active');
    }
    if (currentStep < steps.length) {
    document.getElementById(steps[currentStep]).classList.add('active');
    currentStep++;
    } else {
    clearInterval(stepInterval);
    }
    }, 800);
    }
    hideLoadingState() {
    document.getElementById('loadingOverlay').style.display = 'none';
    // Reset steps
    ['step1', 'step2', 'step3'].forEach(stepId => {
    document.getElementById(stepId).classList.remove('active');
    });
    }
    showErrorState(message) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
    <div class="error-state">
    <div class="error-icon">⚠️</div>
    <h3>Analysis Error</h3>
    <p>${message}</p>
    <button onclick="dashboard.handleAnalysis()" class="retry-btn">Try
    Again</button>
    </div>
    `;
    }
    showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
    notification.remove();
    }, 3000);
    }
    // Export and sharing functions
    exportAnalysis() {
    this.showNotification('Analysis export feature coming soon!', 'info');
    }
    shareAnalysis() {
    this.showNotification('Share functionality coming soon!', 'info');
    }
    scheduleFollowUp() {
    this.showNotification('Follow-up scheduling coming soon!', 'info');
    }
    }
    // Initialize dashboard when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new BusinessIntelligenceDashboard();
    });
    // Add notification styles
    const notificationStyles = `
    .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 10px;
    color: white;
    font-weight: 500;
    z-index: 1001;
    animation: slideIn 0.3s ease-out;
    }
    .notification.info {
    background: #3b82f6;
    }
    .notification.success {
    background: #10b981;
    }
    .notification.warning {
    background: #f59e0b;
    }
    .notification.error {
    background: #ef4444;
    }
    @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
    }
    .error-state {
    text-align: center;
    padding: 60px 20px;
    }
    .error-icon {
    font-size: 3em;
    margin-bottom: 20px;
    }
    .retry-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    margin-top: 20px;
    }
    .analysis-actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    }
    .action-btn {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    }
    .action-btn:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
    }
    .analysis-timestamp {
    font-size: 0.8em;
    color: #64748b;
    }
    `;
    // Inject notification styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);