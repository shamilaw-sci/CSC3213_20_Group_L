import datetime
from app.database import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.patient import Patient, PatientType
from app.models.pharmacy import Medicine
from app.models.opd import OPDVisit, VisitType, QueueStatus
from app.auth_utils import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).filter(User.username == "admin").first():
        print("Database already contains seed data. Skipping.")
        db.close()
        return

    print("Seeding University of Peradeniya Health Centre demo database...")

    # 1. Staff Users
    users = [
        User(
            username="admin",
            full_name="Health Centre Administrator",
            email="admin@gs.pdn.ac.lk",
            hashed_password=get_password_hash("adminpassword"),
            role=UserRole.ADMIN.value,
            phone="+94812392022",
            designation="Chief Administrative Officer"
        ),
        User(
            username="doctor1",
            full_name="Dr. M.A. Dissanayake",
            email="cmohc@gs.pdn.ac.lk",
            hashed_password=get_password_hash("password123"),
            role=UserRole.DOCTOR.value,
            phone="+94812392023",
            designation="Senior Medical Officer / CMO"
        ),
        User(
            username="doctor2",
            full_name="Dr. S.P. Senarathne",
            email="doctor2@gs.pdn.ac.lk",
            hashed_password=get_password_hash("password123"),
            role=UserRole.DOCTOR.value,
            phone="+94812392024",
            designation="Medical Officer"
        ),
        User(
            username="pharmacist1",
            full_name="Mr. P.P.R.W. Bandara",
            email="pharmacy@gs.pdn.ac.lk",
            hashed_password=get_password_hash("password123"),
            role=UserRole.PHARMACIST.value,
            phone="+94812392026",
            designation="Chief Pharmacist"
        ),
        User(
            username="reception1",
            full_name="Mrs. R.M.H.S. Rathnayake",
            email="reception@gs.pdn.ac.lk",
            hashed_password=get_password_hash("password123"),
            role=UserRole.RECEPTION.value,
            phone="+94812392028",
            designation="Nursing Officer / Triage Receptionist"
        ),
        User(
            username="S/22/535",
            full_name="Mr. B.J. M.S.M. Bandara",
            email="s22535@sci.pdn.ac.lk",
            hashed_password=get_password_hash("password123"),
            role=UserRole.STUDENT.value,
            phone="+94771234567"
        )
    ]
    for u in users:
        db.add(u)

    # 2. Medicine Inventory (including Low Stock demo items)
    medicines = [
        Medicine(name="Paracetamol 500mg", generic_name="Paracetamol", category="Analgesic / Antipyretic", dosage_form="Tablet", strength="500mg", stock_quantity=1200, unit="tabs", min_stock_alert=100, batch_number="B2401", supplier="State Pharmaceuticals Manufacturing Corporation (SPMC)"),
        Medicine(name="Cetirizine 10mg", generic_name="Cetirizine HCl", category="Antihistamine", dosage_form="Tablet", strength="10mg", stock_quantity=450, unit="tabs", min_stock_alert=50, batch_number="B2402", supplier="MSD Sri Lanka"),
        Medicine(name="Vitamin C 100mg", generic_name="Ascorbic Acid", category="Vitamin Supplement", dosage_form="Tablet", strength="100mg", stock_quantity=600, unit="tabs", min_stock_alert=60, batch_number="B2403", supplier="SPMC"),
        Medicine(name="Amoxicillin 500mg", generic_name="Amoxicillin Trihydrate", category="Antibiotic", dosage_form="Capsule", strength="500mg", stock_quantity=320, unit="caps", min_stock_alert=80, batch_number="B2404", supplier="MSD Sri Lanka"),
        Medicine(name="Omeprazole 20mg", generic_name="Omeprazole", category="Antacid / PPI", dosage_form="Capsule", strength="20mg", stock_quantity=35, unit="caps", min_stock_alert=50, batch_number="B2405", supplier="SPMC"), # Low stock!
        Medicine(name="Salbutamol Inhaler 100mcg", generic_name="Salbutamol", category="Respiratory", dosage_form="Inhaler", strength="100mcg/dose", stock_quantity=6, unit="inhalers", min_stock_alert=15, batch_number="B2406", supplier="MSD Sri Lanka"), # Low stock!
        Medicine(name="Metformin 500mg", generic_name="Metformin HCl", category="Antidiabetic", dosage_form="Tablet", strength="500mg", stock_quantity=500, unit="tabs", min_stock_alert=100, batch_number="B2407", supplier="SPMC"),
        Medicine(name="Domperidone 10mg", generic_name="Domperidone", category="Antiemetic", dosage_form="Tablet", strength="10mg", stock_quantity=280, unit="tabs", min_stock_alert=40, batch_number="B2408", supplier="Local Supplier"),
        Medicine(name="Oral Rehydration Salts (ORS)", generic_name="ORS Electrolyte", category="Electrolyte Rehydration", dosage_form="Sachet", strength="Standard", stock_quantity=150, unit="sachets", min_stock_alert=30, batch_number="B2409", supplier="MSD Sri Lanka"),
        Medicine(name="Ibuprofen 400mg", generic_name="Ibuprofen", category="NSAID / Pain Relief", dosage_form="Tablet", strength="400mg", stock_quantity=22, unit="tabs", min_stock_alert=50, batch_number="B2410", supplier="SPMC") # Low stock!
    ]
    for m in medicines:
        db.add(m)

    # 3. Patient Profiles (From real Peradeniya register)
    patients = [
        Patient(
            patient_type=PatientType.STUDENT.value,
            reg_no="S/22/535",
            file_no="SCI/2022/535",
            name="Mr. B.J. M.S.M. Bandara",
            title="Mr",
            gender="M",
            age=23,
            faculty="Faculty of Science",
            hall_department="Non-Resident (NRS)",
            academic_year="3rd Year",
            phone_personal="+94771234567",
            blood_group="O+",
            allergies="Penicillin allergy",
            chronic_conditions="Mild Asthma"
        ),
        Patient(
            patient_type=PatientType.STUDENT.value,
            reg_no="M/24/130",
            file_no="MED/2024/130",
            name="Miss D.S. Rajakaruna",
            title="Miss",
            gender="F",
            age=21,
            faculty="Faculty of Medicine",
            hall_department="Sangamitta Hall (SM)",
            academic_year="1st Year",
            phone_personal="+94719876543",
            blood_group="B+",
            allergies="None known",
            chronic_conditions="None"
        ),
        Patient(
            patient_type=PatientType.STUDENT.value,
            reg_no="Ag/24/FT/44",
            file_no="AG/2024/044",
            name="Mr. J.M.K.N. Jayathissa",
            title="Mr",
            gender="M",
            age=22,
            faculty="Faculty of Agriculture",
            hall_department="Non-Resident (NRS)",
            academic_year="1st Year",
            phone_personal="+94765432198",
            blood_group="A+",
            allergies="Sulfa drugs",
            chronic_conditions="Gastritis"
        ),
        Patient(
            patient_type=PatientType.STUDENT.value,
            reg_no="E/20/328",
            file_no="ENG/2020/328",
            name="Mr. Chathuranga U.G.A.",
            title="Mr",
            gender="M",
            age=23,
            faculty="Faculty of Engineering",
            hall_department="Akbar Hall",
            academic_year="Final Year",
            phone_personal="+94721112233",
            blood_group="AB+",
            allergies="None",
            chronic_conditions="Migraine"
        ),
        Patient(
            patient_type=PatientType.STUDENT.value,
            reg_no="A/24/574",
            file_no="ART/2024/574",
            name="Mr. M.M.S. Rikash",
            title="Mr",
            gender="M",
            age=21,
            faculty="Faculty of Arts",
            hall_department="Ramanathan Hall (RNH)",
            academic_year="1st Year",
            phone_personal="+94783334455",
            blood_group="O+",
            allergies="Aspirin",
            chronic_conditions="None"
        ),
        Patient(
            patient_type=PatientType.STAFF.value,
            reg_no="EMP/ELEC/042",
            file_no="STAFF/2019/042",
            name="Mr. Charitha Kumara",
            title="Mr",
            gender="M",
            age=35,
            faculty="University Staff",
            hall_department="Electrical Department",
            nic="198912345678",
            phone_personal="+94715556677",
            blood_group="B+",
            allergies="None",
            chronic_conditions="Hypertension"
        )
    ]
    for p in patients:
        db.add(p)

    db.flush()

    # 4. OPD Initial Active Queue
    today = datetime.date.today()
    p1 = patients[0] # Bandara
    p2 = patients[1] # Rajakaruna
    p3 = patients[2] # Jayathissa
    
    opd_visits = [
        OPDVisit(
            token_number=1,
            visit_date=today,
            patient_id=p1.id,
            patient_reg_no=p1.reg_no,
            patient_name=p1.name,
            patient_age=p1.age,
            patient_sex=p1.gender,
            hall_department=p1.hall_department,
            visit_type=VisitType.FIRST.value,
            status=QueueStatus.IN_CONSULTATION.value,
            priority="NORMAL",
            chief_complaint="High fever and body ache since yesterday"
        ),
        OPDVisit(
            token_number=2,
            visit_date=today,
            patient_id=p2.id,
            patient_reg_no=p2.reg_no,
            patient_name=p2.name,
            patient_age=p2.age,
            patient_sex=p2.gender,
            hall_department=p2.hall_department,
            visit_type=VisitType.FIRST.value,
            status=QueueStatus.WAITING.value,
            priority="NORMAL",
            chief_complaint="Skin rash and mild fever"
        ),
        OPDVisit(
            token_number=3,
            visit_date=today,
            patient_id=p3.id,
            patient_reg_no=p3.reg_no,
            patient_name=p3.name,
            patient_age=p3.age,
            patient_sex=p3.gender,
            hall_department=p3.hall_department,
            visit_type=VisitType.SUBS.value,
            status=QueueStatus.WAITING.value,
            priority="NORMAL",
            chief_complaint="Severe headache and cough"
        )
    ]
    for v in opd_visits:
        db.add(v)

    db.commit()
    db.close()
    print("Database seeding completed successfully! [Users, Medicines, Patients, OPD queue ready]")

if __name__ == "__main__":
    seed_database()
