CREATE DATABASE IF NOT EXISTS tradestore_billing;
USE tradestore_billing;

-- ==============================
-- Providers
-- ==============================
CREATE TABLE IF NOT EXISTS providers (
    id VARCHAR(20) PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    business_category VARCHAR(20) NOT NULL,
    tax_id VARCHAR(30) UNIQUE NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(15),
    address TEXT,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    api_key VARCHAR(64) UNIQUE,
    api_secret_hash VARCHAR(128),
    settlement_bank_code VARCHAR(10),
    settlement_account VARCHAR(20),
    settlement_account_name VARCHAR(100),
    billing_config JSON,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(20),
    updated_by VARCHAR(20),
    INDEX idx_company_name (company_name),
    INDEX idx_business_category (business_category),
    INDEX idx_status (status)
);

-- ==============================
-- Customers
-- ==============================
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(20) PRIMARY KEY,
    provider_id VARCHAR(20),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    meter_number VARCHAR(20) UNIQUE,
    account_number VARCHAR(30) UNIQUE,
    customer_type ENUM('government', 'business', 'individual') DEFAULT 'individual',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    registration_date DATE DEFAULT CURRENT_DATE,
    last_bill_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(20),
    updated_by VARCHAR(20),
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    INDEX idx_name (name),
    INDEX idx_status (status),
    INDEX idx_meter_number (meter_number),
    INDEX idx_account_number (account_number)
);

-- ==============================
-- Bill Batches
-- ==============================
CREATE TABLE IF NOT EXISTS bill_batches (
    id VARCHAR(32) PRIMARY KEY,
    provider_id VARCHAR(20),
    batch_name VARCHAR(100) NOT NULL,
    file_name VARCHAR(200),
    file_size INT,
    file_hash VARCHAR(64) UNIQUE NOT NULL,
    total_records INT DEFAULT 0,
    processed_records INT DEFAULT 0,
    failed_records INT DEFAULT 0,
    status ENUM('pending', 'processed', 'failed', 'completed', 'cancelled') DEFAULT 'pending',
    updated_method ENUM('csv','api','excel','sftp') DEFAULT 'csv',
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    error_summary TEXT, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(20),
    updated_by VARCHAR(20),
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    INDEX idx_provider_id (provider_id),
    INDEX idx_status (status)
);

-- ==============================
-- Bills
-- ==============================
CREATE TABLE IF NOT EXISTS bills (
    id BIGSERIAL PRIMARY KEY,
    provider_id VARCHAR(20),
    customer_id VARCHAR(20),
    batch_id VARCHAR(32),
    bill_reference VARCHAR(30) NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK(amount > 0),
    currency VARCHAR(3) DEFAULT 'XAF',
    due_date DATE NOT NULL,
    billing_period VARCHAR(20) NOT NULL,
    service_address TEXT,
    previous_reading INT,
    current_reading INT,
    consumption INT,
    tarriff_category ENUM('residential', 'commercial', 'industrial', 'government') DEFAULT 'residential', 
    taxes DECIMAL(10,2) DEFAULT 0.00,
    fees DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('pending', 'paid', 'overdue', 'cancelled', 'disputed') DEFAULT 'pending',
    bill_metadata JSON,
    generated_at TIMESTAMP DEFAULT NOW(),
    notified_at TIMESTAMP,
    paid_at TIMESTAMP,
    payment_reference VARCHAR(100),
    payment_method ENUM('credit_card', 'bank_transfer', 'airtel_money' , 'mobile_money', 'cash') DEFAULT 'bank_transfer',
    payment_amount DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(20),
    updated_by VARCHAR(20), 
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES bill_batches(id) ON DELETE SET NULL,
    INDEX idx_provider_id (provider_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);

-- ==============================
-- Payments
-- ==============================
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(30) PRIMARY KEY,
    bill_id BIGINT,
    customer_id VARCHAR(20),
    provider_id VARCHAR(20),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'XAF',
    payment_method ENUM('credit_card', 'bank_transfer', 'mobile_money', 'cash') NOT NULL,
    payment_channel ENUM('ussd', 'app', 'web', 'agent') NOT NULL,
    external_reference VARCHAR(20) NOT NULL,
    payment_provider ENUM('airtel_money', 'mtn_money', 'visa', 'mastercard') NOT NULL,
    payer_phone VARCHAR(15) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    gateway_response JSON DEFAULT '{}',
    commission_rate DECIMAL(5,4) DEFAULT 0.02,
    commission_amount DECIMAL(12,2) DEFAULT 0.00,
    provider_amount DECIMAL(12,2) DEFAULT 0.00,
    settlement_status ENUM('pending', 'settled', 'failed') DEFAULT 'pending',
    settlement_date DATETIME NULL,
    settlement_reference VARCHAR(50) NULL,
    initiated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- Notifications
-- ==============================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    customer_id VARCHAR(20),
    bill_id BIGINT,
    provider_id VARCHAR(20),
    notification_type VARCHAR(15) ENUM('new_bill', 'reminder', 'payment_confirmation', 'payment_failure') NOT NULL,
    channel NOT NULL,
    recipient VARCHAR(100) NOT NULL,
    message_template VARCHAR(255) NOT NULL, 
    message_content TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'delivered') DEFAULT 'pending',
    gateway_reference VARCHAR(50) NULL,
    gateway_response JSON DEFAULT '{}',
    cost DECIMAL(10,2) DEFAULT 0.0,
    retry_count INT DEFAULT 0,
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- ==============================
-- Audit Logs
-- ==============================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    action ENUM('create', 'update', 'delete', 'view') NOT NULL,
    user_id VARCHAR(50) NULL,
    user_type ENUM('admin', 'customer', 'provider', 'system') NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    changes JSON NULL,
    metadata JSON NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- System Configs
-- ==============================
CREATE TABLE IF NOT EXISTS system_configs (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    data_type ENUM('string', 'integer', 'boolean', 'json', 'decimal') DEFAULT 'string' NOT NULL,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    updated_by VARCHAR(30),
    updated_at TIMESTAMP DEFAULT NOW()
);
