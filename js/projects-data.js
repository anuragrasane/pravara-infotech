/* ============================================
   Projects Data Manager
   - Stores all project data in localStorage
   - Images uploaded via admin are stored as base64 data URLs
   - Manually placed images in images/projects/ can be referenced by path
   ============================================ */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'pravara_projects';
  const ADMIN_PASS_KEY = 'pravara_admin_auth';
  const ADMIN_PASSWORD = 'pravara@2025'; // Change this

  /* ---- Resolve image path relative to root ---- */
  // Detects if we're inside /admin/ subfolder and adjusts paths
  function resolveImagePath(src) {
    if (!src) return '';
    // base64 / object URL — return as-is
    if (src.startsWith('data:') || src.startsWith('blob:')) return src;
    // Already absolute or external
    if (src.startsWith('http') || src.startsWith('/')) return src;
    // Strip leading ../ for public pages (they're at root)
    const isAdmin = window.location.pathname.includes('/admin');
    if (isAdmin) {
      // from admin/ → need ../images/...
      if (!src.startsWith('../')) return '../' + src;
      return src;
    } else {
      // from root → plain images/...
      return src.replace(/^\.\.\//, '');
    }
  }

  // Default seed data
  const DEFAULT_PROJECTS = [
    {
      id: 'agritech',
      tag: 'Agriculture',
      title: 'Agri-Tech ERP System',
      description: 'A comprehensive enterprise resource planning platform specifically designed for agricultural businesses. The system integrates crop management, supply chain tracking, financial accounting, and real-time analytics into a unified dashboard. Farmers and agribusiness managers can monitor operations end-to-end — from seed procurement and field management to harvest logistics and market sales — enabling data-driven decisions that improve yield and reduce waste.',
      features: [
        'Real-time crop monitoring dashboard',
        'Supply chain & inventory management',
        'Financial accounting & invoicing',
        'Weather integration & forecasting',
        'Harvest planning & logistics',
        'Multi-farm support with role management'
      ],
      tech: ['React', 'Node.js', 'MongoDB', 'AWS', 'Chart.js', 'REST API'],
      images: [
        'images/port-agritech.jpg',
        'images/svc-web.jpg',
        'images/svc-cloud.jpg'
      ],
      featured: true,
      order: 0
    },
    {
      id: 'dairy',
      tag: 'Mobile App',
      title: 'Dairy Farmers App',
      description: 'A mobile application that bridges the gap between dairy farmers and consumers by digitizing the entire dairy supply chain. The app features real-time milk collection tracking, automated billing, route optimization for delivery, and quality analytics. Farmers can manage their livestock records, track daily yields, and access market prices — all from their smartphone. The consumer-facing side enables subscription management and doorstep delivery tracking.',
      features: [
        'Milk collection & quality tracking',
        'Automated billing & payments',
        'Route optimization for delivery',
        'Livestock health record management',
        'Consumer subscription management',
        'Real-time delivery tracking'
      ],
      tech: ['React Native', 'Firebase', 'Node.js', 'Google Maps API', 'Razorpay'],
      images: [
        'images/port-dairy.jpg',
        'images/svc-mobile.jpg',
        'images/svc-uiux.jpg'
      ],
      featured: true,
      order: 1
    },
    {
      id: 'cropai',
      tag: 'AI / ML',
      title: 'Crop Disease AI Detection',
      description: 'An AI-powered mobile solution that uses advanced image recognition and deep learning models to identify crop diseases in real-time. Farmers simply take a photo of affected crop leaves using their smartphone camera, and the system instantly analyzes the image, identifies the disease with high accuracy, and provides actionable treatment recommendations. The model was trained on thousands of images covering 30+ common crop diseases across major agricultural crops.',
      features: [
        'Real-time disease identification via camera',
        'Treatment & pesticide recommendations',
        'Disease history & trend analytics',
        'Offline mode for remote areas',
        '30+ disease categories supported',
        'Multi-crop support (rice, wheat, tomato, etc.)'
      ],
      tech: ['Python', 'TensorFlow', 'Keras', 'Flutter', 'REST API', 'OpenCV'],
      images: [
        'images/port-ai.jpg',
        'images/svc-research.jpg',
        'images/svc-mobile.jpg'
      ],
      featured: true,
      order: 2
    },
    {
      id: 'irrigation',
      tag: 'IoT',
      title: 'Smart Irrigation System',
      description: 'An IoT-based smart irrigation solution that enables precision agriculture through real-time environmental monitoring. The system uses a network of soil moisture sensors, weather stations, and water flow meters to automatically optimize irrigation schedules. Farmers receive alerts and can control irrigation pumps remotely via a mobile app. The platform reduces water usage by up to 40% while ensuring optimal crop hydration based on real-time soil and weather conditions.',
      features: [
        'Soil moisture & temperature sensors',
        'Automated pump control via IoT',
        'Weather-based irrigation scheduling',
        'Water usage analytics & reporting',
        'Mobile app for remote monitoring',
        'Alerts for anomalies & maintenance'
      ],
      tech: ['Arduino', 'Raspberry Pi', 'MQTT', 'Node.js', 'React', 'AWS IoT'],
      images: [
        'images/port-iot.jpg',
        'images/svc-cloud.jpg',
        'images/svc-web.jpg'
      ],
      featured: true,
      order: 3
    },
    {
      id: 'ecommerce',
      tag: 'E-Commerce',
      title: 'E-Commerce Platform',
      description: 'A full-featured multi-vendor marketplace built for scale, supporting thousands of products across multiple categories. The platform features advanced search with filters, AI-powered product recommendations, multi-gateway payment processing, vendor dashboards with analytics, and a complete order management system. Designed for high performance with a modern, intuitive UI, the platform delivers a seamless shopping experience across all devices.',
      features: [
        'Multi-vendor marketplace architecture',
        'AI-powered product recommendations',
        'Advanced search with smart filters',
        'Multi-gateway payment processing',
        'Vendor analytics dashboard',
        'Inventory & order management system'
      ],
      tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'Elasticsearch'],
      images: [
        'images/svc-ecommerce.jpg',
        'images/svc-web.jpg',
        'images/svc-uiux.jpg'
      ],
      featured: false,
      order: 4
    },
    {
      id: 'healthcare',
      tag: 'Healthcare',
      title: 'Healthcare Analytics Platform',
      description: 'A HIPAA-compliant healthcare analytics platform built for hospitals and healthcare providers. The system aggregates patient data from multiple sources — EHR systems, lab results, and medical devices — into unified dashboards with powerful visualization and reporting capabilities. Healthcare administrators can track key performance indicators, monitor patient outcomes, identify trends, and generate compliance reports. The platform ensures end-to-end data encryption and strict access controls.',
      features: [
        'HIPAA-compliant data handling',
        'Patient data visualization dashboards',
        'Multi-source data integration (EHR, labs)',
        'Automated compliance reporting',
        'Role-based access controls',
        'Trend analysis & outcome tracking'
      ],
      tech: ['React', 'Python', 'Django', 'PostgreSQL', 'D3.js', 'Docker'],
      images: [
        'images/port-healthcare.jpg',
        'images/svc-cloud.jpg',
        'images/svc-research.jpg'
      ],
      featured: false,
      order: 5
    }
  ];

  const ProjectsDB = {
    resolveImagePath,

    getAll() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) { /* ignore */ }
      this.saveAll(DEFAULT_PROJECTS);
      return JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    },

    saveAll(projects) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      } catch (e) {
        console.warn('ProjectsDB: localStorage quota exceeded or unavailable.');
      }
    },

    getFeatured() {
      return this.getAll()
        .filter(p => p.featured)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
        .slice(0, 4);
    },

    getById(id) {
      return this.getAll().find(p => p.id === id) || null;
    },

    add(project) {
      const all = this.getAll();
      project.id = project.id || ('proj_' + Date.now());
      project.order = project.order ?? all.length;
      project.featured = !!project.featured;
      all.push(project);
      this.saveAll(all);
      return project;
    },

    update(id, updates) {
      const all = this.getAll();
      const idx = all.findIndex(p => p.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates };
      this.saveAll(all);
      return all[idx];
    },

    delete(id) {
      this.saveAll(this.getAll().filter(p => p.id !== id));
    },

    reset() {
      this.saveAll(JSON.parse(JSON.stringify(DEFAULT_PROJECTS)));
    },

    // Auth helpers
    checkAuth() {
      return sessionStorage.getItem(ADMIN_PASS_KEY) === 'true';
    },
    login(password) {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_PASS_KEY, 'true');
        return true;
      }
      return false;
    },
    logout() {
      sessionStorage.removeItem(ADMIN_PASS_KEY);
    }
  };

  window.ProjectsDB = ProjectsDB;

})(window);
