-- Creación del esquema de base de datos
CREATE DATABASE IF NOT EXISTS job_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE job_portal;

-- Tabla: Candidates
CREATE TABLE IF NOT EXISTS candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    years_of_experience INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla: Vacancies
CREATE TABLE IF NOT EXISTS vacancies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    min_years_experience INT NOT NULL DEFAULT 0,
    status ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla: Applications
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    vacancy_id INT NOT NULL,
    cover_letter TEXT NOT NULL,
    source ENUM('REFERRAL', 'INTERNAL', 'JOB_BOARD', 'OTHER') NOT NULL,
    score INT NOT NULL DEFAULT 0,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'TOP') NOT NULL,
    status ENUM('RECEIVED', 'IN_REVIEW', 'REJECTED', 'HIRED') NOT NULL DEFAULT 'RECEIVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Datos de prueba (Semillas)
INSERT INTO candidates (id, name, email, years_of_experience) VALUES
(1, 'Jennifer López', 'jennifer.lopez@example.com', 4),
(2, 'Carlos Mendoza', 'carlos.mendoza@example.com', 1),
(3, 'Ana Gutiérrez', 'ana.gutierrez@example.com', 6);

INSERT INTO vacancies (id, title, min_years_experience, status) VALUES
(1, 'Backend Developer Node.js Junior', 2, 'OPEN'),
(2, 'Data Analyst Senior', 5, 'CLOSED');