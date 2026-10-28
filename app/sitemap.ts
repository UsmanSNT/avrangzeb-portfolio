import { MetadataRoute } from 'next'
import { getHomeDictionary } from '@/content/locales'
import { defaultLocale } from '@/lib/i18n/config'
import { allLessons, courses, lessonHref, levelHref } from '@/content/courses'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://avrangzebabdujalilov.com'
  const now = new Date()

  const dictionary = getHomeDictionary(defaultLocale)
  const caseStudyProjects = dictionary.myProjects.projects.filter(
    (project) => project.hasCaseStudyPage !== false
  )

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/notes`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/knowledge-hub`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/network-courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/english-courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/books`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/auth/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/auth/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = caseStudyProjects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const courseList = Object.values(courses)

  const levelRoutes: MetadataRoute.Sitemap = courseList.flatMap((course) =>
    course.levels.map((level) => ({
      url: `${baseUrl}${levelHref(course, level.id)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  )

  const lessonRoutes: MetadataRoute.Sitemap = courseList.flatMap((course) =>
    allLessons(course).map((lesson) => ({
      url: `${baseUrl}${lessonHref(course, lesson.id)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  )

  return [...staticRoutes, ...projectRoutes, ...levelRoutes, ...lessonRoutes]
}
