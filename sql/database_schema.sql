-- Grant Bidding Platform Database Schema

-- Organizations table
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grants table
CREATE TABLE grants (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    funding_amount DECIMAL(12,2) NOT NULL,
    application_deadline DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'awarded')),
    created_by INTEGER REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bids table
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    grant_id INTEGER REFERENCES grants(id) ON DELETE CASCADE,
    organization_id INTEGER REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    proposal TEXT NOT NULL,
    requested_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(grant_id, organization_id) -- One bid per organization per grant
);

-- Insert sample data
INSERT INTO organizations (name, email, description) VALUES
('Green Energy Initiative', 'contact@greenenergyinit.org', 'Non-profit focused on renewable energy projects'),
('Community Health Foundation', 'info@communityhealthfound.org', 'Healthcare access improvement organization'),
('Education Forward', 'hello@educationforward.org', 'Educational technology and access charity');

INSERT INTO grants (title, description, funding_amount, application_deadline, created_by) VALUES
('Clean Energy Community Projects', 'Funding for local renewable energy installations and education programs', 50000.00, '2025-09-30', 1),
('Rural Healthcare Access', 'Grants for improving healthcare delivery in underserved rural communities', 75000.00, '2025-08-15', 2),
('Digital Learning Tools', 'Support for developing accessible educational technology solutions', 30000.00, '2025-10-01', 3);

INSERT INTO bids (grant_id, organization_id, title, proposal, requested_amount) VALUES
(1, 2, 'Solar Panel Installation for Community Center', 'Proposal to install solar panels on the local community center, providing clean energy and educational opportunities for residents to learn about renewable energy.', 45000.00),
(2, 3, 'Mobile Health Clinic Technology', 'Implementing tablet-based patient management system for rural mobile health clinics to improve care coordination and data collection.', 25000.00);