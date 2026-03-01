#!/usr/bin/env python3
"""Generate a professional PDF resume for Mathias."""

from fpdf import FPDF

# ─── Configuration ────────────────────────────────────────────────────────────
OUTPUT = "client/public/resume.pdf"

# Colors (RGB)
DARK   = (15, 15, 22)     # near-black
ACCENT = (0, 180, 130)    # teal-green
WHITE  = (240, 238, 235)
GRAY   = (140, 140, 155)
LIGHT  = (200, 200, 210)

# Margins / layout
LEFT   = 20
RIGHT  = 190
WIDTH  = RIGHT - LEFT
COL1   = 125  # left column width
COL2_X = LEFT + COL1 + 8
COL2_W = RIGHT - COL2_X


class ResumePDF(FPDF):
    """Custom PDF with dark background and accent styling."""

    def header(self):
        pass  # no default header

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "", 7)
        self.set_text_color(*GRAY)
        self.cell(0, 5, "mathias-clergy.vercel.app", align="C")

    # ── helpers ────────────────────────────────────────────────────────────
    def accent_line(self, y, x1=LEFT, x2=RIGHT):
        self.set_draw_color(*ACCENT)
        self.set_line_width(0.6)
        self.line(x1, y, x2, y)

    def section_title(self, title):
        self.ln(7)
        y = self.get_y()
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(*ACCENT)
        self.cell(0, 6, title.upper(), new_x="LMARGIN", new_y="NEXT")
        self.accent_line(self.get_y() + 1)
        self.ln(5)

    def entry_title(self, title, right_text=""):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*WHITE)
        tw = self.get_string_width(title)
        self.cell(tw + 2, 5, title)
        if right_text:
            self.set_font("Helvetica", "", 8)
            self.set_text_color(*GRAY)
            self.cell(0, 5, right_text, align="R", new_x="LMARGIN", new_y="NEXT")
        else:
            self.ln(5)

    def entry_subtitle(self, text):
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(*LIGHT)
        self.cell(0, 5, text, new_x="LMARGIN", new_y="NEXT")

    def body_text(self, text):
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*LIGHT)
        self.multi_cell(WIDTH, 4.5, text)
        self.ln(1)

    def bullet(self, text):
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*LIGHT)
        x = self.get_x()
        self.cell(4, 4.5, "-")
        self.multi_cell(WIDTH - 4, 4.5, text)

    def skill_pills(self, skills):
        """Render skills as inline pill tags."""
        x_start = LEFT
        x = x_start
        y = self.get_y()
        pill_h = 6
        pad = 3
        gap = 2
        self.set_font("Helvetica", "", 8)
        for skill in skills:
            tw = self.get_string_width(skill) + pad * 2
            if x + tw > RIGHT:
                x = x_start
                y += pill_h + gap
            # pill bg
            self.set_fill_color(30, 30, 42)
            self.set_draw_color(50, 50, 65)
            self.rect(x, y, tw, pill_h, style="DF")
            # pill text
            self.set_xy(x, y)
            self.set_text_color(*LIGHT)
            self.cell(tw, pill_h, skill, align="C")
            x += tw + gap
        self.set_y(y + pill_h + 4)


def build():
    pdf = ResumePDF("P", "mm", "A4")
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    # Dark background
    pdf.set_fill_color(*DARK)
    pdf.rect(0, 0, 210, 297, "F")

    # ━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    pdf.set_xy(LEFT, 18)
    pdf.set_font("Helvetica", "B", 26)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 10, "MATHIAS AIDOO")
    pdf.ln(11)

    pdf.set_font("Helvetica", "", 12)
    pdf.set_text_color(*ACCENT)
    pdf.cell(0, 6, "Software Engineer  |  Full-Stack Developer  |  UI/UX Designer")
    pdf.ln(9)

    # Contact row
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(*LIGHT)
    contact_items = [
        "mathiaskuamiclergy2002@gmail.com",
        "Kumasi, Ghana",
        "github.com/Pro-Clergy",
        "linkedin.com/in/mathias-aidoo",
    ]
    pdf.cell(0, 5, "  |  ".join(contact_items), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    pdf.accent_line(pdf.get_y())
    pdf.ln(2)

    # ━━━ SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    pdf.section_title("Professional Summary")
    pdf.body_text(
        "Versatile software engineer and Computer Science student with 3+ years of hands-on "
        "experience spanning full-stack web development, mobile app development, cybersecurity, "
        "UI/UX design, and data-driven solutions. Proficient in React, Next.js, Flutter, Python, "
        "and Node.js with a strong foundation in secure-by-design principles. Proven ability to "
        "lead data mining research projects, architect scalable systems, and translate complex "
        "business requirements into clean, maintainable software. Actively seeking opportunities "
        "to apply my multidisciplinary skills in impactful engineering roles."
    )

    # ━━━ EDUCATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    pdf.section_title("Education")
    pdf.entry_title("BSc. Computer Science", "Kumasi Technical University")
    pdf.entry_subtitle("Specialization: Data Warehousing & Data Mining")
    pdf.ln(2)
    pdf.bullet(
        "Led Group One research project analyzing 5,000+ retail transactions across "
        "8 Ghanaian cities using K-Means clustering, Apriori algorithm, and predictive "
        "modeling (Decision Tree, Random Forest, Logistic Regression)."
    )
    pdf.bullet(
        "Applied data preprocessing, feature engineering, and visualization techniques "
        "to extract actionable insights from real-world datasets."
    )

    # ━━━ TECHNICAL SKILLS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    pdf.section_title("Technical Skills")

    skill_groups = [
        ("Languages", "Python, JavaScript, TypeScript, Dart, SQL, HTML, CSS"),
        ("Frontend", "React, Next.js, Tailwind CSS, Framer Motion, Figma"),
        ("Mobile", "Flutter, React Native, Cross-Platform Development"),
        ("Backend", "Node.js, Express, REST APIs, Serverless (Vercel)"),
        ("Security", "Threat Modeling, Vulnerability Assessment, OWASP, Wireshark"),
        ("Data & ML", "Pandas, NumPy, Scikit-learn, Matplotlib, TensorFlow"),
        ("Databases", "MongoDB, PostgreSQL, Mongoose"),
        ("DevOps", "Git, GitHub, Vercel, Docker, Linux, Nodemailer, Postman"),
    ]

    for label, items in skill_groups:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*ACCENT)
        pdf.cell(28, 5, label + ":")
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(*LIGHT)
        pdf.cell(0, 5, items, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)

    # ━━━ PROJECTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    pdf.section_title("Featured Projects")

    projects = [
        {
            "title": "Customer Purchase Behavior Analyzer",
            "tech": "Python, Scikit-learn, Pandas, Matplotlib",
            "bullets": [
                "Built a data mining system analyzing 5,000+ retail transactions across 8 cities.",
                "Implemented K-Means clustering, Apriori association rules, and predictive models "
                "(Decision Tree, Random Forest, Logistic Regression) for customer segmentation.",
            ],
        },
        {
            "title": "E-Commerce Platform",
            "tech": "React, Node.js, MongoDB, Stripe",
            "bullets": [
                "Developed a full-stack online store with authentication, product catalog, "
                "shopping cart, and Stripe payment integration.",
                "Built a responsive admin dashboard for inventory and order management.",
            ],
        },
        {
            "title": "Task Management Dashboard",
            "tech": "Next.js, Tailwind CSS, PostgreSQL, Socket.io",
            "bullets": [
                "Created a collaborative project management tool with real-time updates "
                "and drag-and-drop Kanban boards.",
                "Implemented team assignments, notifications, and performance analytics.",
            ],
        },
        {
            "title": "AI Chatbot for Customer Support",
            "tech": "Python, Flask, TensorFlow, REST API",
            "bullets": [
                "Engineered an intelligent conversational AI with NLP capabilities, "
                "trained on domain-specific data.",
                "Automated customer inquiry handling, reducing manual support workload.",
            ],
        },
        {
            "title": "Portfolio Website (This Resume)",
            "tech": "Next.js, TypeScript, MongoDB, Tailwind, Vercel",
            "bullets": [
                "Designed and deployed a professional portfolio with server-side API routes, "
                "contact form with email notifications, visitor analytics, and rate limiting.",
                "Implemented security hardening: HSTS, honeypot bot protection, input "
                "sanitization, and 6 security headers.",
            ],
        },
    ]

    for proj in projects:
        pdf.entry_title(proj["title"], proj["tech"])
        for b in proj["bullets"]:
            pdf.bullet(b)
        pdf.ln(2)

    # ━━━ SERVICES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    pdf.section_title("Services Offered")
    services = [
        "Full-Stack Web Development (React, Next.js, Node.js)",
        "Mobile App Development (Flutter, React Native)",
        "UI/UX Design & Prototyping (Figma)",
        "Cybersecurity & Secure Application Development",
        "System Analysis & Architecture Design",
        "Data Analysis & Machine Learning (Python, Scikit-learn)",
        "RESTful API Development & Database Architecture",
        "Technical Consulting & Cloud Deployment",
    ]
    for s in services:
        pdf.bullet(s)

    # ━━━ INTERESTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    pdf.section_title("Interests")
    pdf.body_text(
        "Open-source contributions, SaaS product development, emerging AI/ML techniques, "
        "and mentoring aspiring developers in the Ghanaian tech community."
    )

    # ─── Save ─────────────────────────────────────────────────────────────
    pdf.output(OUTPUT)
    print(f"Resume saved to {OUTPUT}")
    print(f"Pages: {pdf.pages_count}")


if __name__ == "__main__":
    build()
