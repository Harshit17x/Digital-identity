export const STUDENT_PROFILE = {
  name: "Alex Rivers",
  institution: "Stanford University",
  headline: "Computer Science & AI Undergrad",
  aiHeroSummary: "You've added 1 resume, 3 AI certifications, and 2 projects to your digital identity repository."
};

export const INITIAL_DOCUMENTS = [
  {
    id: "doc-1",
    filename: "Alex_Rivers_AI_Resume.pdf",
    file_url: "https://stanford.edu/~arivers/resume.pdf",
    category: "Academics",
    confidence: 0.99,
    title: "Alex Rivers — Software & AI Engineering Resume",
    issuer_or_organization: "Stanford University",
    doc_date: "2025-01-10",
    skills_mentioned: ["Python", "PyTorch", "React", "TypeScript", "System Design", "FastAPI"],
    summary: "Comprehensive AI engineering resume highlighting CS coursework at Stanford, full-stack React web apps, PyTorch ML models, and tech internship experience.",
    timeline_year: 2025,
    notes: "Primary engineering resume verified for summer 2025 AI research and industry roles.",
    relationships: [
      { source_doc_id: "doc-1", relation_type: "implies", target_category: "Skills", target_description: "Skill: Full-Stack & AI System Architecture" },
      { source_doc_id: "doc-1", relation_type: "anchors", target_category: "Projects", target_description: "Anchors NeuroVision AI & Autonomous Path Planner Projects" }
    ]
  },
  {
    id: "doc-2",
    filename: "Stanford_AI_Machine_Learning_Cert.pdf",
    file_url: "https://online.stanford.edu/courses/soe-ycs0001-machine-learning-specialization",
    category: "Certifications",
    confidence: 0.98,
    title: "Stanford Machine Learning & AI Specialization",
    issuer_or_organization: "Stanford Online & AI Lab",
    doc_date: "2024-09-15",
    skills_mentioned: ["Machine Learning", "PyTorch", "Deep Learning", "Neural Networks", "Computer Vision"],
    summary: "Verified AI certification covering supervised learning, neural network optimization, transformer models, and PyTorch computer vision pipelines.",
    timeline_year: 2024,
    notes: "Graduated with High Honors (98.4% final score across all 4 AI modules).",
    relationships: [
      { source_doc_id: "doc-2", relation_type: "implies", target_category: "Skills", target_description: "Skill: Deep Learning & PyTorch Architecture" },
      { source_doc_id: "doc-2", relation_type: "foundation_for", target_category: "Projects", target_description: "Foundation for NeuroVision 3D Brain Segmentation Project" }
    ]
  },
  {
    id: "doc-3",
    filename: "NeuroVision_3D_Brain_Segmentation.pdf",
    file_url: "https://github.com/alexrivers/neurovision-ai",
    category: "Projects",
    confidence: 0.99,
    title: "NeuroVision AI — 3D Brain MRI Segmentation",
    issuer_or_organization: "Stanford AI Lab",
    doc_date: "2025-02-10",
    skills_mentioned: ["PyTorch", "Computer Vision", "Python", "Medical AI", "Docker"],
    summary: "Attention-guided 3D U-Net PyTorch pipeline for automated MRI tumor segmentation achieving 94.2% Dice coefficient.",
    timeline_year: 2025,
    notes: "Trained on BraTS 2024 dataset. Open-sourced on GitHub with 140+ stars.",
    relationships: [
      { source_doc_id: "doc-3", relation_type: "demonstrates", target_category: "Skills", target_description: "Skill: 3D Computer Vision & PyTorch" },
      { source_doc_id: "doc-3", relation_type: "showcased_at", target_category: "Achievements", target_description: "Showcased at Stanford AI Symposium" }
    ]
  },
  {
    id: "doc-4",
    filename: "Autonomous_Drone_Path_Planner.pdf",
    file_url: "https://github.com/alexrivers/ros2-drone-planner",
    category: "Projects",
    confidence: 0.94,
    title: "Autonomous Drone Path Planner",
    issuer_or_organization: "Stanford Robotics Club",
    doc_date: "2024-08-18",
    skills_mentioned: ["ROS2", "Python", "Robotics", "C++", "LiDAR"],
    summary: "Real-time obstacle avoidance and path planning algorithm for quadcopters utilizing ROS2 and 3D LiDAR point clouds.",
    timeline_year: 2024,
    notes: "Tested on physical Crazyflie quadcopters in the campus robotics hangar.",
    relationships: [
      { source_doc_id: "doc-4", relation_type: "won_award", target_category: "Achievements", target_description: "Won 1st Place at Campus Robotics Showcase" }
    ]
  },
  {
    id: "doc-5",
    filename: "CloudPeak_Internship_Evaluation.pdf",
    file_url: "https://cloudpeaksystems.com/internships",
    category: "Internships",
    confidence: 0.97,
    title: "Software Engineering Intern",
    issuer_or_organization: "CloudPeak Systems Inc.",
    doc_date: "2024-06-01",
    skills_mentioned: ["AWS", "Python", "FastAPI", "Docker", "DevOps"],
    summary: "Architected serverless microservices on AWS Lambda reducing API latency by 35% across 2M daily API requests.",
    timeline_year: 2024,
    notes: "Received strong recommendation letter from VP of Engineering.",
    relationships: [
      { source_doc_id: "doc-5", relation_type: "applied", target_category: "Skills", target_description: "Applied Skill: Serverless AWS Architecture" }
    ]
  },
  {
    id: "doc-6",
    filename: "DeepScale_AI_Internship_Offer.pdf",
    file_url: "https://deepscalelabs.ai",
    category: "Internships",
    confidence: 0.98,
    title: "AI Research Scientist Intern",
    issuer_or_organization: "DeepScale AI Labs",
    doc_date: "2025-01-20",
    skills_mentioned: ["PyTorch", "LLMs", "RAG", "Python", "CUDA"],
    summary: "Upcoming internship focused on fine-tuning Llama-3 open weights for domain-specific retrieval-augmented generation.",
    timeline_year: 2025,
    notes: "Selected out of 450+ applicants for the Summer 2025 AI Research Cohort.",
    relationships: [
      { source_doc_id: "doc-6", relation_type: "validates", target_category: "Skills", target_description: "Validates: Advanced LLM & RAG Research Capability" }
    ]
  },
  {
    id: "doc-7",
    filename: "Stanford_Official_Academic_Transcript.pdf",
    file_url: "https://registrar.stanford.edu",
    category: "Academics",
    confidence: 0.99,
    title: "Stanford Official CS Transcript (GPA 3.94)",
    issuer_or_organization: "Stanford University Office of the Registrar",
    doc_date: "2024-12-18",
    skills_mentioned: ["Algorithms", "Machine Learning", "Operating Systems", "Discrete Math"],
    summary: "Official academic transcript verifying 3.94 GPA in Computer Science B.S., Dean's List for 5 consecutive quarters.",
    timeline_year: 2024,
    notes: "A+ grades in CS229 (Machine Learning) and CS231n (Convolutional Neural Networks).",
    relationships: [
      { source_doc_id: "doc-7", relation_type: "anchors", target_category: "Academics", target_description: "Anchors Academic Credential Standard" }
    ]
  },
  {
    id: "doc-8",
    filename: "AWS_Cloud_Practitioner_Cert.pdf",
    file_url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    category: "Certifications",
    confidence: 0.98,
    title: "AWS Certified Cloud Practitioner",
    issuer_or_organization: "Amazon Web Services",
    doc_date: "2024-04-15",
    skills_mentioned: ["AWS", "Cloud Computing", "DevOps", "Serverless"],
    summary: "Validation of foundational cloud architecture, AWS security compliance, and serverless infrastructure deployment.",
    timeline_year: 2024,
    notes: "Passed with 912/1000 score. Foundation for CloudPeak Internship.",
    relationships: [
      { source_doc_id: "doc-8", relation_type: "implies", target_category: "Skills", target_description: "Skill: AWS Infrastructure & Cloud Security" }
    ]
  }
];
