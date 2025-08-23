import React from 'react';

const AboutSection = () => {
  // Mock theme object - you can replace with your actual theme
  const theme = {
    card: 'bg-white dark:bg-gray-900',
    text: 'text-gray-900 dark:text-white',
    textSecondary: 'text-gray-600 dark:text-gray-300'
  };
  
  const isDarkMode = false; // Replace with your actual dark mode state
  
  // Mock skills data - replace with your actual skills
  const skills = [
    { name: 'Full-Stack Development', level: 90, category: 'Web Technologies' },
    { name: 'Machine Learning', level: 85, category: 'AI & Data Science' },
    { name: 'React & Next.js', level: 88, category: 'Frontend' },
    { name: 'Python & Node.js', level: 92, category: 'Backend' }
  ];

  return (
    <section id="about" className={`py-16 sm:py-20 px-4 sm:px-8 ${theme.card}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Section */}
          <div className="order-1 lg:order-1">
            <div className="relative">
              <div className="w-full h-96 lg:h-[500px] overflow-hidden rounded-2xl">
                <img 
                  src='/assets/hero.png'  
                  alt="Harshith Daraboina" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8 order-2 lg:order-2">
            {/* Main Heading */}
            <div className="space-y-4">
              <p className={`text-lg ${theme.textSecondary}`}>
                We craft digital experiences and see the world through a
              </p>
              
              {/* Outlined Text Effect */}
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span 
                  className="text-transparent"
                  style={{
                    WebkitTextStroke: '2px #374151',
                    textStroke: '2px #374151'
                  }}
                >
                  lens of innovation
                </span>
                <br />
                <span className={`${theme.text}`}>
                  and excellence
                </span>
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className={`${theme.textSecondary} text-lg leading-relaxed`}>
                As a passionate Computer Science student at IIIT Dharwad, I specialize in building robust full-stack applications and intelligent machine learning solutions. With a strong foundation in modern web technologies and AI algorithms, I create products that are both technically sound and user-centric.
              </p>
              <p className={`${theme.textSecondary} leading-relaxed`}>
                My approach combines analytical problem-solving with creative design thinking, resulting in solutions that are not just functional but also delightful to use.
              </p>
            </div>

            {/* Call to Action */}
            <div className="pt-4">
              <button className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                <span>Know more about my work</span>
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Professional Skills & Expertise */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <h4 className={`text-lg font-semibold ${theme.text} mb-8`}>Technical Expertise</h4>
              
              {/* Core Technologies */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className={`text-sm font-semibold ${theme.text} uppercase tracking-wider text-gray-600 dark:text-gray-400`}>Frontend Development</h5>
                    <div className="flex flex-wrap gap-2">
                      {['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((tech) => (
                        <span key={tech} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className={`text-sm font-semibold ${theme.text} uppercase tracking-wider text-gray-600 dark:text-gray-400`}>Backend & Database</h5>
                    <div className="flex flex-wrap gap-2">
                      {['Node.js', 'Python', 'MongoDB', 'PostgreSQL'].map((tech) => (
                        <span key={tech} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className={`text-sm font-semibold ${theme.text} uppercase tracking-wider text-gray-600 dark:text-gray-400`}>Machine Learning & AI</h5>
                    <div className="flex flex-wrap gap-2">
                      {['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas'].map((tech) => (
                        <span key={tech} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className={`text-sm font-semibold ${theme.text} uppercase tracking-wider text-gray-600 dark:text-gray-400`}>DevOps & Tools</h5>
                    <div className="flex flex-wrap gap-2">
                      {['Git', 'Docker', 'AWS', 'Linux'].map((tech) => (
                        <span key={tech} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Achievements */}
              <div className="space-y-6">
                <h5 className={`text-sm font-semibold ${theme.text} uppercase tracking-wider text-gray-600 dark:text-gray-400`}>Professional Highlights</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className={`text-2xl font-bold ${theme.text} mb-2`}>3+</div>
                    <div className={`text-sm ${theme.textSecondary}`}>Years Experience</div>
                  </div>
                  
                  <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className={`text-2xl font-bold ${theme.text} mb-2`}>15+</div>
                    <div className={`text-sm ${theme.textSecondary}`}>Projects Delivered</div>
                  </div>
                  
                  <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className={`text-2xl font-bold ${theme.text} mb-2`}>100%</div>
                    <div className={`text-sm ${theme.textSecondary}`}>Client Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* Education & Certifications */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className={`text-sm font-semibold ${theme.text} uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-3`}>Education</h5>
                    <div className={`${theme.text} font-medium`}>Computer Science Engineering</div>
                    <div className={`text-sm ${theme.textSecondary}`}>IIIT Dharwad</div>
                  </div>
                  
                  <div>
                    <h5 className={`text-sm font-semibold ${theme.text} uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-3`}>Focus Areas</h5>
                    <div className={`text-sm ${theme.textSecondary} space-y-1`}>
                      <div>• Full-Stack Web Development</div>
                      <div>• Machine Learning & AI</div>
                      <div>• Software Architecture</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;