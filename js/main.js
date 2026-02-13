// Main JavaScript for CardMax - Backend Integration
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:8000' 
    : window.location.origin;

// Main utilities and initialization

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 3000);
}

function animateValue(id, start, end, duration, prefix) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;

    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        
        if (prefix === '₹') {
            obj.innerHTML = '₹' + value.toLocaleString('en-IN');
        } else {
            obj.innerHTML = prefix + value.toLocaleString('en-IN');
        }
        
        if (value >= end) {
            clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    run();
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Initialize drag scroll for cards track
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('cardsTrack');
    if (!track) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.style.cursor = 'grabbing';
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });
    
    track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.cursor = 'grab';
    });
    
    track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.cursor = 'grab';
    });
    
    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        track.scrollLeft = scrollLeft - walk;
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (document.getElementById('cardModal')?.classList.contains('active')) {
        if (e.key === 'Escape') closeCardModal();
        if (e.key === 'ArrowLeft') navigateCard(-1);
        if (e.key === 'ArrowRight') navigateCard(1);
    }
    if (e.key === 'Escape' && document.getElementById('demoDashboard')?.classList.contains('active')) {
        closeDashboard();
    }
});
/**
 * Initialize file upload functionality
 */
function initFileUpload() {
    // Check if we're on the analyzer page
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadZone) {
        console.log('Upload zone not found - not on analyzer page');
        return;
    }
    
    console.log('Initializing file upload...');
    
    // Create hidden file input if it doesn't exist
    if (!fileInput) {
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'fileInput';
        input.accept = '.csv,.xlsx,.xls,.pdf';
        input.style.display = 'none';
        document.body.appendChild(input);
    }
    
    const input = document.getElementById('fileInput');
    
    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.classList.add('dragover');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.classList.remove('dragover');
        });
    });
    
    uploadZone.addEventListener('drop', handleDrop);
    input.addEventListener('change', handleFileSelect);
    
    // Click to upload
    uploadZone.addEventListener('click', () => {
        input.click();
    });
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) handleFile(files[0]);
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length) handleFile(files[0]);
}

/**
 * Main file upload handler - sends to Flask backend
 */
async function handleFile(file) {
    console.log('Handling file:', file.name);
    
    // Validate file type
    const allowedTypes = ['.csv', '.xlsx', '.xls', '.pdf'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
        showToast('Invalid file type. Please upload CSV, Excel, or PDF.');
        return;
    }
    
    // Show loading state
    showUploadLoading(true);
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        console.log('Sending to:', `${API_BASE_URL}/api/analyze`);
        
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            body: formData
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Upload failed: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Analysis result:', result);
        
        if (result.success) {
            // Store analysis data in localStorage
            localStorage.setItem('cardmax_analysis', JSON.stringify(result.data));
            localStorage.setItem('cardmax_analysis_time', new Date().toISOString());
            
            showToast('Analysis complete! Redirecting...');
            
            setTimeout(() => {
                // Redirect to analyzer dashboard
                window.location.href = 'analyzer.html?view=dashboard';
            }, 1500);
        } else {
            throw new Error(result.error || 'Analysis failed');
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Error: ' + error.message);
        showUploadLoading(false);
    }
}

function showUploadLoading(show) {
    const uploadZone = document.getElementById('uploadZone');
    if (!uploadZone) return;
    
    if (show) {
        uploadZone.innerHTML = `
            <div class="upload-loading">
                <div class="spinner"></div>
                <p>Analyzing your statement...</p>
                <p class="upload-subtitle">Extracting transactions and categorizing</p>
            </div>
        `;
        uploadZone.style.pointerEvents = 'none';
    } else {
        uploadZone.innerHTML = `
            <div class="upload-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
            </div>
            <p class="upload-text">Drop your statement here</p>
            <p class="upload-subtitle">or click to browse (CSV, Excel, PDF)</p>
        `;
        uploadZone.style.pointerEvents = 'auto';
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('CardMax initialized');
    
    // Initialize existing functions
    populateCards();
    initScrollProgress();
    
    // Initialize file upload (only on analyzer page)
    initFileUpload();
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
    
    // Check for analysis data on dashboard
    if (window.location.search.includes('view=dashboard') || window.location.hash.includes('dashboard')) {
        loadAnalysisData();
    }
});

/**
 * Load and display analysis data on dashboard
 */
function loadAnalysisData() {
    const data = localStorage.getItem('cardmax_analysis');
    if (!data) {
        console.log('No analysis data found');
        return;
    }
    
    try {
        const analysis = JSON.parse(data);
        console.log('Loading analysis data:', analysis);
        
        // Update dashboard with real data
        if (analysis.totals) {
            const totalEl = document.getElementById('dashTotal');
            const missedEl = document.getElementById('dashMissed');
            const txnsEl = document.getElementById('dashTxns');
            
            if (totalEl) {
                totalEl.textContent = '₹' + Math.round(analysis.totals.total_spend || 0).toLocaleString('en-IN');
            }
            if (missedEl) {
                // Calculate from rewards_analysis if available
                const missed = analysis.rewards_analysis?.[0]?.missed_rewards_monthly || 0;
                missedEl.textContent = '₹' + Math.round(missed * 12).toLocaleString('en-IN');
            }
            if (txnsEl) {
                txnsEl.textContent = analysis.totals.transaction_count || 0;
            }
        }
        
        // Update pie chart with real categories
        if (analysis.category_totals) {
            updatePieChart(analysis.category_totals);
        }
        
    } catch (e) {
        console.error('Error loading analysis:', e);
    }
}

function updatePieChart(categoryTotals) {
    // Implementation to update pie chart with real data
    console.log('Updating pie chart:', categoryTotals);}
    // Reset analysis and show upload again
function resetAnalysis() {
    // Clear stored data
    localStorage.removeItem('cardmax_analysis');
    localStorage.removeItem('cardmax_selected_card');
    
    // Reset UI
    document.getElementById('dashboardMain').classList.remove('active');
    document.getElementById('uploadSection').style.display = 'flex';
    
    // Reset upload zone
    const uploadZone = document.getElementById('uploadZone');
    uploadZone.classList.remove('active');
    uploadZone.innerHTML = `
        <div class="upload-icon">
            <svg viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
        </div>
        <div class="upload-text">Drop your statement here</div>
        <div class="upload-subtitle">or click to browse (PDF, CSV, Excel)</div>
    `;
    
    // Reset card selection
    document.querySelectorAll('.card-select').forEach(el => el.classList.remove('selected'));
    selectedCardId = null;
    
    showToast('Ready for new analysis');
}