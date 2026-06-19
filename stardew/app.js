let allBundles = [];
let allFish = [];
let allCrops = [];
let allArtisan = [];
let allRanch = [];
let allRobin = [];

// 独立过滤状态追踪
let currentSeason = 'All';
let currentRoom = 'All';
let currentFishSeason = 'All';
let currentFishLocation = 'All';
let currentCropSeason = 'All';
let currentRanchCategory = 'All';
let currentRobinCategory = 'All';

// 👑 1. 一级主目录标签切换
function switchMainTab(panelId, buttonElement) {
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => panel.classList.remove('active'));

    const tabBtns = document.querySelectorAll('.nav-item');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    const targetPanel = document.getElementById(panelId);
    if (targetPanel) targetPanel.classList.add('active');
    if (buttonElement) buttonElement.classList.add('active');
}

// 📅 2. 页面加载时拉取本地 JSON 数据流
document.addEventListener("DOMContentLoaded", () => {
    fetch('bundles_data.json').then(res => res.json()).then(data => { allBundles = data; renderBundles(); }).catch(err => console.error(err));
    fetch('fishing_data.json').then(res => res.json()).then(data => { allFish = data; renderFishing(); }).catch(err => console.error(err));
    fetch('crops_data.json').then(res => res.json()).then(data => { allCrops = data; renderCrops(); }).catch(err => console.error(err));
    fetch('artisan_data.json').then(res => res.json()).then(data => { allArtisan = data; renderArtisan(); }).catch(err => console.error(err));
    fetch('ranch_data.json').then(res => res.json()).then(data => { allRanch = data; renderRanch(); }).catch(err => console.error(err));
    fetch('carpenter_data.json').then(res => res.json()).then(data => { allRobin = data; renderRobin(); }).catch(err => console.error(err));
});

// 🎨 3. 动态列表渲染函数群
function renderBundles() {
    const container = document.getElementById("bundle-container");
    if (!container) return; container.innerHTML = "";
    allBundles.forEach(bundle => {
        const matchSeason = (currentSeason === 'All' || bundle.season === currentSeason || bundle.season === 'All Seasons');
        const matchRoom = (currentRoom === 'All' || bundle.room === currentRoom);
        if (matchSeason && matchRoom) {
            container.innerHTML += `
                <div class="card">
                    <h2>${bundle.name}</h2>
                    <div class="meta-info">
                        <span class="badge">Room: ${bundle.room}</span>
                        <span class="badge">Season: ${bundle.season}</span>
                    </div>
                    <div class="card-details">
                        <span><b>Required:</b> ${bundle.items.join(', ')}</span>
                    </div>
                    <div class="reward"><b>Reward:</b> ${bundle.reward}</div>
                </div>`;
        }
    });
}

function renderFishing() {
    const container = document.getElementById("fishing-container");
    if (!container) return; container.innerHTML = "";
    allFish.forEach(fish => {
        const matchSeason = (currentFishSeason === 'All' || fish.season === currentFishSeason || fish.season === 'All Seasons');
        const matchLocation = (currentFishLocation === 'All' || fish.location.includes(currentFishLocation));
        if (matchSeason && matchLocation) {
            container.innerHTML += `
                <div class="card" style="border-left: 4px solid #1565c0;">
                    <h2>${fish.name}</h2>
                    <div class="meta-info">
                        <span class="badge" style="background-color: #e3f2fd; color: #0d47a1;">Location: ${fish.location}</span>
                    </div>
                    <div class="card-details">
                        <span><b>Weather:</b> ${fish.weather}</span>
                        <span><b>Time:</b> ${fish.time}</span>
                    </div>
                    <div class="reward" style="border-left-color: #1565c0;"><b>Difficulty:</b> ${fish.difficulty}</div>
                </div>`;
        }
    });
}

function renderCrops() {
    const container = document.getElementById("crops-container");
    if (!container) return; 
    container.innerHTML = "";

    allCrops.forEach(crop => {
        const matchSeason = (currentCropSeason === 'All' || crop.season === currentCropSeason || crop.season === 'Multi-Season');
        if (matchSeason) {
            
            // 🧹 核心清洗：把中文、全角/半角括号以及多余的提示语通通干掉
            const cleanName = crop.name.replace(/[\u4e00-\u9fa5]+/g, '').replace(/\s*[\(\)（）]\s*/g, '').trim();
            const cleanGrowth = crop.growth_days.replace(/[\u4e00-\u9fa5]+/g, '').replace(/\s*[\(\)（）]\s*/g, '').trim();
            const cleanSeedCost = crop.seed_cost.replace(/[\u4e00-\u9fa5]+/g, '').replace(/\s*[\(\)（）]\s*/g, '').trim();
            const cleanSellPrice = crop.sell_price.replace(/[\u4e00-\u9fa5]+/g, '').replace(/\s*[\(\)（）]\s*/g, '').trim();
            const cleanProfit = crop.daily_profit.replace(/[\u4e00-\u9fa5]+/g, '').replace(/\s*[\(\)（）]\s*/g, '').trim();

            // 🌟 重新规范 HTML 结构：强制绑定为 crop-card 并在内部规范数据
            container.innerHTML += `
                <div class="crop-card">
                    <div class="crop-header">
                        <h2>🌱 ${cleanName}</h2>
                    </div>
                    <div class="crop-meta">
                        <span class="crop-badge season">☀️ ${crop.season}</span>
                        <span class="crop-badge duration">⏳ ${cleanGrowth}</span>
                    </div>
                    <div class="crop-stats">
                        <div class="stat-row">
                            <span>💰 Seed Cost:</span>
                            <span class="stat-val cost">${cleanSeedCost}</span>
                        </div>
                        <div class="stat-row">
                            <span>📦 Harvest Price:</span>
                            <span class="stat-val price">${cleanSellPrice}</span>
                        </div>
                    </div>
                    <div class="crop-profit">
                        📈 Avg Daily Profit: <span class="profit-val">${cleanProfit}/day</span>
                    </div>
                </div>`;
        }
    });
}

function renderArtisan() {
    const container = document.getElementById("artisan-container");
    if (!container) return; container.innerHTML = "";
    allArtisan.forEach(machine => {
        container.innerHTML += `
            <div class="card" style="border-left: 4px solid #7b1fa2;">
                <h2>${machine.name}</h2>
                <div class="meta-info">
                    <span class="badge" style="background-color: #faf5ff; color:#4a148c;">Unlock: ${machine.unlock}</span>
                </div>
                <div class="card-details">
                    <span><b>Ingredients:</b> ${machine.ingredients}</span>
                </div>
                <div class="reward" style="border-left-color: #7b1fa2; background-color: #f3e5f5;"><b>Use:</b> ${machine.use}</div>
            </div>`;
    });
}

function renderRanch() {
    const container = document.getElementById("ranch-container");
    if (!container) return; container.innerHTML = "";
    allRanch.forEach(item => {
        const isLivestock = (item.building !== "None");
        let matchCategory = false;
        if (currentRanchCategory === 'All') matchCategory = true;
        else if (currentRanchCategory === 'Livestock') matchCategory = isLivestock;
        else if (currentRanchCategory === 'Shop') matchCategory = !isLivestock;

        if (matchCategory) {
            container.innerHTML += `
                <div class="card" style="border-left: 4px solid #388e3c;">
                    <h2>${item.name}</h2>
                    <div class="meta-info">
                        <span class="badge" style="background-color: #f1f8e9; color: #1b5e20;">Cost: ${item.cost}</span>
                    </div>
                    <div class="card-details">
                        <span><b>Requirement:</b> ${item.unlock}</span>
                        ${isLivestock ? `<span><b>Building:</b> ${item.building}</span>` : ''}
                    </div>
                    <div class="reward" style="border-left-color: #388e3c;"><b>Function:</b> ${item.produce}</div>
                </div>`;
        }
    });
}

function renderRobin() {
    const container = document.getElementById("robin-container");
    if (!container) return; container.innerHTML = "";
    allRobin.forEach(build => {
        let matchCategory = false;
        const nameLower = build.name.toLowerCase();
        if (currentRobinCategory === 'All') matchCategory = true;
        else if (currentRobinCategory === 'Housing') matchCategory = nameLower.includes('upgrade') || nameLower.includes('farmhouse');
        else if (currentRobinCategory === 'Animal') matchCategory = nameLower.includes('coop') || nameLower.includes('barn');
        else if (currentRobinCategory === 'Utility') matchCategory = !nameLower.includes('upgrade') && !nameLower.includes('farmhouse') && !nameLower.includes('coop') && !nameLower.includes('barn');

        if (matchCategory) {
            container.innerHTML += `
                <div class="card" style="border-left: 4px solid #5d4037;">
                    <h2>${build.name}</h2>
                    <div class="meta-info">
                        <span class="badge" style="background-color: #efebe9; color: #3e2723;">Cost: ${build.cost}</span>
                        <span class="badge">Size: ${build.size}</span>
                    </div>
                    <div class="card-details">
                        <span><b>Materials:</b> ${build.materials}</span>
                    </div>
                    <div class="reward" style="border-left-color: #5d4037;"><b>Function:</b> ${build.function}</div>
                </div>`;
        }
    });
}

// 🎛️ 4. 二级标签高亮与数据联动控制中心
function filterSeason(season) { 
    currentSeason = season; 
    const btns = document.querySelectorAll('#bundles-panel .filter-group:nth-child(1) .filter-btn');
    btns.forEach(b => { if(b.innerText === season) b.classList.add('active'); else b.classList.remove('active'); });
    renderBundles(); 
}

function filterRoom(room) { 
    currentRoom = room; 
    const btns = document.querySelectorAll('#bundles-panel .filter-group:nth-child(2) .filter-btn');
    btns.forEach(b => { 
        if((room === 'All' && b.innerText.includes('All')) || b.innerText.includes(room)) b.classList.add('active'); 
        else b.classList.remove('active'); 
    });
    renderBundles(); 
}

function filterFish(type, value, btnElement) {
    if (type === 'season') currentFishSeason = value; 
    if (type === 'location') currentFishLocation = value;
    if (btnElement) {
        const siblings = btnElement.parentElement.querySelectorAll('.filter-btn'); 
        siblings.forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }
    renderFishing();
}

function filterCrop(season, btnElement) {
    currentCropSeason = season; 
    if (btnElement) {
        const siblings = btnElement.parentElement.querySelectorAll('.filter-btn');
        siblings.forEach(btn => btn.classList.remove('active')); 
        btnElement.classList.add('active');
    }
    renderCrops();
}

function filterRanch(category, btnElement) {
    currentRanchCategory = category; 
    if (btnElement) {
        const siblings = btnElement.parentElement.querySelectorAll('.filter-btn');
        siblings.forEach(btn => btn.classList.remove('active')); 
        btnElement.classList.add('active');
    }
    renderRanch();
}

function filterRobin(category, btnElement) {
    currentRobinCategory = category;
    if (btnElement) {
        const siblings = btnElement.parentElement.querySelectorAll('.filter-btn');
        siblings.forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }
    renderRobin();
}