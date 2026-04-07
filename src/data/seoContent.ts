export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  features: string[];
  faqs: { question: string; answer: string }[];
  longContent: string;
}

export const SEO_CONTENT: Record<string, SEOData> = {
  'postgresql-erd-designer': {
    title: 'Visual PostgreSQL ERD Designer | Create DB Schema Online',
    description: 'The most intuitive visual database designer for PostgreSQL. Create Entity Relationship Diagrams and generate production-ready SQL instantly. Free, interactive, and no login required.',
    keywords: 'postgresql erd designer, postgresql database modeler, visual postgresql schema builder, online pgsql erd tool',
    features: ['PostgreSQL dialect support', 'Custom data types', 'Instant SQL generation', 'Foreign key visualization'],
    faqs: [
      {
        question: 'How do I generate PostgreSQL SQL from my ERD?',
        answer: 'Simply design your database using our drag-and-drop interface. The SQL code is generated in real-time in the right sidebar. You can copy it or download it as a .sql file.'
      },
      {
        question: 'Does it support PostgreSQL specific types like JSONB and Arrays?',
        answer: 'Yes! Our tool supports all standard PostgreSQL data types including JSONB, UUID, and Arrays for modern application development.'
      }
    ],
    longContent: `
      <h2>The Ultimate Visual PostgreSQL Database Modeler</h2>
      <p>Designing a robust PostgreSQL database requires precision and clarity. Our **Visual PostgreSQL ERD Designer** provides an industrial-grade interface to model your database schema without writing a single line of DDL manually. Whether you are building a complex SaaS application or a simple blog, visualizing your Entity Relationship Diagram (ERD) is the first step toward a scalable architecture.</p>
      
      <p>PostgreSQL is known for its advanced features like extensibility and performance. Our builder reflects this by offering specialized support for PostgreSQL-specific elements. You can easily define tables, set primary and foreign keys, and visualize relationships with clear, interactive lines that represent one-to-one, one-to-many, or many-to-many connections.</p>
      
      <h3>Why use an Online ERD Tool for PostgreSQL?</h3>
      <p>Traditional database modeling software often requires heavy installations and complex configurations. Our online tool is weightless, running entirely in your browser with local-first persistence. This means your work is saved automatically without requiring a cloud account, ensuring your database designs stay private and secure.</p>
      
      <p>Key benefits include:
        <ul>
          <li><strong>Instant Export:</strong> Get clean, optimized SQL scripts ready for PGAdmin or any CLI.</li>
          <li><strong>Real-time Feedback:</strong> See how your changes affect the SQL schema as you drag tables.</li>
          <li><strong>Team Friendly:</strong> Export your designs as JSON to share with your team or version control them in Git.</li>
        </ul>
      </p>
      <p>Start designing your next PostgreSQL project today with the most intuitive ERD tool on the web.</p>
    `
  },
  'mysql-schema-builder': {
    title: 'Free MySQL Schema Builder | Visual Database Modeling Tool',
    description: 'Design your MySQL database schemas visually. Drag-and-drop tables, define relationships, and export SQL scripts for MySQL 8.0+. High-performance database architect tool.',
    keywords: 'mysql schema builder, visual mysql designer, free mysql erd tool, mysql database modeler online',
    features: ['MySQL 8.0+ support', 'Visual relationship mapping', 'Export to .sql files', 'Schema version control'],
    faqs: [
      {
        question: 'Is this MySQL builder free?',
        answer: 'Yes, our MySQL Schema Builder is 100% free to use. No registration is required to start designing your database.'
      },
      {
        question: 'Can I export my schema to MySQL Workbench?',
        answer: 'Our tool generates standard SQL scripts that are compatible with MySQL Workbench, phpMyAdmin, and any other MySQL management tool.'
      }
    ],
    longContent: `
      <h2>Modern MySQL Database Design Made Simple</h2>
      <p>MySQL is the world\'s most popular open-source database. Designing schemas for it should be just as accessible. Our **MySQL Schema Builder** brings a modern, drag-and-drop experience to MySQL database architects. Forget the days of struggling with complex UI or writing thousands of lines of SQL by hand.</p>
      
      <p>With our visual editor, you can create tables in seconds, define columns with specific MySQL engines (like InnoDB), and establish relationships with a simple click-and-drag motion. The tool automatically handles foreign key constraints, ensuring your database remains consistent and optimized for performance.</p>
      
      <h3>Features for MySQL Developers</h3>
      <p>We built this tool with the modern developer in mind. It supports MySQL 5.7 and 8.0+ features, including modern data types and constraints. The generated SQL is formatted for readability and follows best practices for database normalization.</p>
      
      <p>Whether you are designing a relational database for a mobile app or a web-scale platform, our visual builder helps you catch design flaws early. Visualizing the data flow between tables is crucial for optimizing queries and ensuring long-term maintainability of your MySQL environment.</p>
    `
  },
  'prisma-schema-generator': {
    title: 'Visual Prisma Schema Generator | Model to schema.prisma',
    description: 'Convert your visual ERD diagrams directly into Prisma schema files. Model your data and get the schema.prisma you need. Perfect for Next.js and TypeScript projects.',
    keywords: 'prisma schema generator, visual prisma modeler, erd to prisma converter, online prisma editor',
    features: ['Prisma model generation', 'One-to-many & Many-to-many support', 'Enums and Attributes', 'Modern developer experience'],
    faqs: [
      {
        question: 'Does it support Prisma enums?',
        answer: 'Yes! You can define enums and use them as types for your columns, and they will be correctly exported to your prisma.schema file.'
      },
      {
        question: 'How do I use the generated schema?',
        answer: 'Simply copy the generated code into your schema.prisma file and run "npx prisma generate" to update your Prisma Client.'
      }
    ],
    longContent: `
      <h2>The Best Way to Write Prisma Schemas</h2>
      <p>Prisma has revolutionized how we interact with databases in the TypeScript ecosystem. But writing long \`schema.prisma\` files by hand can still be error-prone. Our **Visual Prisma Schema Generator** provides a visual interface to model your data, which is then automatically converted into perfectly formatted Prisma schema code.</p>
      
      <p>Visual modeling is especially helpful with Prisma because it makes relationship mapping (like \`@relation\` fields) much clearer. See exactly how your models connect without getting lost in the back-and-forth of text-based configuration.</p>
      
      <h3>Streamline your TypeScript Workflow</h3>
      <p>If you are using Next.js, Remix, or any modern Node.js framework, this tool is indispensable. It allows you to focus on the architecture of your data rather than the syntax of the schema file. Once you are happy with the visual design, just copy the code, and you are ready to ship.</p>
    `
  },
  'erd-to-sql-converter': {
    title: 'Visual ERD to SQL Converter | Transform Diagrams to Database',
    description: 'Transform your Entity Relationship Diagrams into clean, optimized SQL for any database system. Support for PostgreSQL, MySQL, SQLite, and more. Visual modeling at scale.',
    keywords: 'erd to sql converter, diagram to sql online, visual database designer, database architect tool',
    features: ['Multi-dialect support', 'Clean SQL output', 'Visual modeling', 'One-click export'],
    faqs: [
      {
        question: 'Which SQL dialects are supported?',
        answer: 'We currently support PostgreSQL, MySQL, SQLite, and also export to Prisma schema format.'
      },
      {
        question: 'Is my data stored on your servers?',
        answer: 'No. All your database designs remain in your browser\'s local storage. We do not store your schema designs on our servers, ensuring maximum privacy.'
      }
    ],
    longContent: `
      <h2>Powerful ERD to SQL Conversion Online</h2>
      <p>Creating a database shouldn\'t be a manual chore. Our **ERD to SQL Converter** bridges the gap between high-level architectural design and low-level code. By providing a powerful visual canvas, we empower developers to think about their data structures before they start building.</p>
      
      <p>Our converter is designed for speed. The moment you add a column or link two tables, the underlying SQL engine updates. This immediate feedback loop is essential for rapid prototyping and agile database development.</p>
    `
  },
  'default': {
    title: 'ERDtoSQL | Professional Visual ERD Designer & SQL Generator',
    description: 'The fastest, free online database designer. Build ERD diagrams with drag-and-drop ease and instantly generate SQL for PostgreSQL, MySQL, SQLite and Prisma schemas.',
    keywords: 'database designer, erd builder, sql generator, visual schema editor, online database modeling',
    features: ['Drag-and-drop interface', 'Multi-database support', 'Instant code generation', 'Local-first privacy'],
    faqs: [
      {
        question: 'What is ERDtoSQL?',
        answer: 'ERDtoSQL is a professional visual editor for creating database schemas. It allows you to design tables and relationships and automatically generates the corresponding SQL code.'
      }
    ],
    longContent: `
      <h2>The Future of Database Design is Visual</h2>
      <p>ERDtoSQL is built for the modern developer who values both speed and precision. Database modeling is the foundation of every great application, and we believe it should be as intuitive as drawing on a whiteboard, but as powerful as a professional IDE.</p>
    `
  }
};
