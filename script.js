// ===================================
// Mobile Menu Toggle
// ===================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle hamburger menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===================================
// Smooth Scrolling
// ===================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Smooth scroll for "View Projects" button
const viewProjectsBtn = document.querySelector('.btn-primary');
if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener('click', (e) => {
        const href = viewProjectsBtn.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// ===================================
// Form Validation
// ===================================

const inquiryForm = document.getElementById('inquiryForm');

// Validation rules
const validationRules = {
    fullName: {
        required: true,
        validate: (value) => value.trim().length > 0,
        message: 'Full name is required'
    },
    email: {
        required: true,
        validate: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        },
        message: 'Please enter a valid email address'
    },
    phone: {
        required: true,
        validate: (value) => {
            const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
            return value.trim().length > 0 && phoneRegex.test(value);
        },
        message: 'Please enter a valid phone number'
    },
    projectType: {
        required: true,
        validate: (value) => value !== '',
        message: 'Please select a project type'
    },
    description: {
        required: true,
        validate: (value) => value.trim().length > 10,
        message: 'Project description must be at least 10 characters'
    },
    budget: {
        required: true,
        validate: (value) => value !== '',
        message: 'Please select a budget range'
    },
    deadline: {
        required: true,
        validate: (value) => {
            if (!value) return false;
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        },
        message: 'Please select a future date'
    },
    source: {
        required: true,
        validate: (value) => value !== '',
        message: 'Please select how you found me'
    }
};

// Validate individual field
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    const rule = validationRules[fieldName];

    if (!rule) return true;

    const value = field.value;
    const isValid = rule.validate(value);

    if (!isValid) {
        errorElement.textContent = rule.message;
        field.style.borderColor = 'var(--error-color)';
        return false;
    } else {
        errorElement.textContent = '';
        field.style.borderColor = '';
        return true;
    }
}

// Validate services checkboxes
function validateServices() {
    const checkboxes = document.querySelectorAll('input[name="services"]');
    const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    const errorElement = document.getElementById('servicesError');

    if (!isChecked) {
        errorElement.textContent = 'Please select at least one service';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

// Add real-time validation
Object.keys(validationRules).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
        field.addEventListener('blur', () => validateField(fieldName));
        field.addEventListener('change', () => validateField(fieldName));
    }
});

// Validate services on change
document.querySelectorAll('input[name="services"]').forEach(checkbox => {
    checkbox.addEventListener('change', validateServices);
});

// ===================================
// Form Submission
// ===================================

inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;

    // Validate all input fields
    Object.keys(validationRules).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isFormValid = false;
        }
    });

    // Validate services
    if (!validateServices()) {
        isFormValid = false;
    }

    const formMessage = document.getElementById('formMessage');

    if (isFormValid) {
        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            projectType: document.getElementById('projectType').value,
            services: Array.from(document.querySelectorAll('input[name="services"]:checked'))
                .map(checkbox => checkbox.value),
            description: document.getElementById('description').value,
            budget: document.getElementById('budget').value,
            deadline: document.getElementById('deadline').value,
            source: document.getElementById('source').value,
            submittedAt: new Date().toLocaleString()
        };

        // Log form data to console (frontend only - no backend)
        console.log('Client Inquiry Form Data:', formData);

        // Store in localStorage for reference
        localStorage.setItem('lastInquiry', JSON.stringify(formData));

        // Display success message
        formMessage.textContent = '✓ Thank you! Your inquiry has been received. I\'ll get back to you soon.';
        formMessage.classList.add('success');
        formMessage.classList.remove('error');

        // Reset form
        inquiryForm.reset();

        // Clear success message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.classList.remove('success');
        }, 5000);

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        // Display error message
        formMessage.textContent = '✗ Please fill in all required fields correctly.';
        formMessage.classList.add('error');
        formMessage.classList.remove('success');

        // Scroll to first error
        const firstError = inquiryForm.querySelector('[style*="border-color"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// ===================================
// Utility Functions
// ===================================

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-container')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add active class to current navigation link based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
});

// ===================================
// Initialization
// ===================================

console.log('Portfolio website loaded successfully!');
