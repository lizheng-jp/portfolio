import type { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Zheng",
  lastName: "LI",
  name: "Zheng Li",
  role: "Software and ML Engineer",
  avatar: "/images/avatar.jpg",
  email: "eric.lizheng@outlook.com",
  location: "Asia/Tokyo", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["Chinese", "English", "Japanese"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}&apos;s Newsletter</>,
  description: (
    <>
      I occasionally write about Android, Machine Learning, and share thoughts on the intersection
      of engineering.
    </>
  ),
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/1994ericlee",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/%E9%8C%9A-%E6%9D%8E-a30068293/",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Software and ML engineer</>,
  featured: {
    display: false,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Once UI</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
    <>
      I&apos;m Li Zheng, a software engineer at Sharp Corporation, where I develop Mobile, Web and
      ML Application.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I&apos;m a software engineer with a passion for building amzing applications. I have
        experience in Android and Machine Learning. I&apos;m currently working at Sharp Corporation.
        I like to learn new things and I&apos;m always looking for new challenges. Also I will share
        my experience and thoughts on this website.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Sharp Corporation",
        timeframe: "2024 - Present",
        role: "Software and Machine Learning Engineer",
        achievements: [
          `Using Machine Learning to detect and classify the anomaly in the production line, helped
            Manufacturing Department to analysis and improve the manufacturing process. Anomaly Detection
            accuracy increased to 92%, and the classification accuracy increased to 85%.`,
          `Reconstruction of the Android application, by using MVVM architecture, reduced the
            complexity of the code by 40%. By implementing an automatic version update mechanism, each
            update cycle was reduced by 90%.`,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          // {
          //   src: "/images/projects/project-01/cover-01.jpg",
          //   alt: "Once UI Project",
          //   width: 16,
          //   height: 9,
          // },
        ],
      },
      {
        company: "ShangHai Golden Bridge Co., Ltd",
        timeframe: "2016 - 2018",
        role: "Software Engineer",
        achievements: [
          `Participated in the development of multiple Android applications, including a paperless meeting application,
            an announcement display application, and an access control display application.`,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Ritsumeikan University",
        description: <>Studied image processing, machine learning, data science.(2022.4-2024.3)</>,
      },
      {
        name: "NanJing Xiaozhuang University",
        description: <>Studied software engineering(2012.9-2016.7)</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Machine Learning",
        description: <>Image classification, Anomaly Detection, Image Denoise.</>,
        tags: [
          {
            name: "Pytorch",
            icon: "pytorch",
          },
          {
            name: "Tensorflow",
            icon: "tensorflow",
          },
          {
            name: "Pandas",
            icon: "pandas",
          },

          {
            name: "Numpy",
            icon: "numpy",
          },
          {
            name: "Scipy",
            icon: "scipy",
          },
          {
            name: "Jupyter",
            icon: "jupyter",
          },
          {
            name: "Matplotlib",
            icon: "matplotlib",
          },
          {
            name: "Scikit-learn",
            icon: "scikit-learn",
          },
          {
            name: "MLflow",
            icon: "mlflow",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          // {
          //   src: "/images/projects/project-01/cover-02.jpg",
          //   alt: "Project image",
          //   width: 16,
          //   height: 9,
          // },
          // {
          //   src: "/images/projects/project-01/cover-03.jpg",
          //   alt: "Project image",
          //   width: 16,
          //   height: 9,
          // },
        ],
      },
      {
        title: "Mobile",
        description: <>Mobile Application Development.</>,
        tags: [
          {
            name: "Java",
            icon: "java",
          },
          {
            name: "Kotlin",
            icon: "kotlin",
          },
          {
            name: "Flutter",
            icon: "flutter",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          // {
          //   src: "/images/projects/project-01/cover-04.jpg",
          //   alt: "Project image",
          //   width: 16,
          //   height: 9,
          // },
        ],
      },
      {
        title: "Web",
        description: <>Web application and backend development.</>,
        tags: [
          {
            name: "Spring Boot",
            icon: "spring",
          },
          {
            name: "Java",
            icon: "java",
          },
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "TypeScript",
            icon: "typescript",
          },
          {
            name: "Node.js",
            icon: "nodejs",
          },
          {
            name: "PostgreSQL",
            icon: "postgresql",
          },
        ],
        images: [],
      },
      {
        title: "Engineering Tools",
        description: <>CI/CD, monitoring, and performance testing.</>,
        tags: [
          {
            name: "Jenkins",
            icon: "jenkins",
          },
          {
            name: "Grafana",
            icon: "grafana",
          },
          {
            name: "JMeter",
            icon: "jmeter",
          },
        ],
        images: [],
      },
      {
        title: "AI Tools",
        description: <>AI-assisted coding, research, and workflow automation.</>,
        tags: [
          {
            name: "Gemini",
            icon: "gemini",
          },
          {
            name: "Codex",
            icon: "codex",
          },
          {
            name: "Kiro",
            icon: "kiro",
          },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    {
      src: "/images/gallery/img-01.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/AB8E95BB-BE2F-498C-92C8-7101BF9238D9_1_105_c.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/40FCC903-2644-4BEB-A236-77E0B7270B75_1_105_c.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/25BDE34E-8A48-4867-BFC7-432EF5215377_4_5005_c.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/3D15DD79-C242-4942-B29D-D4E808086BD0_1_105_c.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/E1146520-8D7A-4BE3-85E2-7CB673577808_1_105_c.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/A4C091A9-1247-40D5-B1BC-5E701A09A722_1_201_a.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/7C431273-9B08-450D-927F-0622D8AB5F16_1_105_c.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/FF5D36BC-7F6F-4941-B701-B8CA24EC8350_1_105_c.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
