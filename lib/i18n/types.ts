export type Locale = "en" | "ko" | "uz" | "ru";

export interface ProjectGoal {
  title: string;
  description: string;
}

export interface ShowcaseProject {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  technologies: readonly string[];
  color: string;
}

export interface HomeDictionary {
  nav: {
    home: string;
    about: string;
    skills: string;
    projects: string;
    books: string;
    gallery: string;
    itNews: string;
    myProjects: string;
    notes: string;
    knowledgeHub: string;
    cv: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    viewProjects: string;
    contact: string;
    terminal: {
      whoami: string;
      skills: string;
      status: string;
    };
  };
  about: {
    title: string;
    greeting: string;
    intro: string;
    passion: string;
    goal: string;
    education: string;
    university: string;
    faculty: string;
    years: string;
    certificates: string;
    preparingCerts: string;
    stats: {
      projects: string;
      certificates: string;
      experience: string;
    };
  };
  skills: {
    title: string;
    additional: string;
    cybersecurity: string;
  };
  projects: {
    title: string;
    completed: string;
    inProgress: string;
    projectsList: ProjectGoal[];
  };
  books: {
    title: string;
    subtitle: string;
    addNew: string;
    noQuotes: string;
    addFirst: string;
    viewAll: string;
    bookTitle: string;
    bookTitlePlaceholder: string;
    author: string;
    authorPlaceholder: string;
    quote: string;
    quotePlaceholder: string;
    imageLabel: string;
    uploadImage: string;
    changeImage: string;
    cancel: string;
    save: string;
    add: string;
    editTitle: string;
    addTitle: string;
    confirmDelete: string;
    likes: string;
    from: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    addNew: string;
    noItems: string;
    addFirst: string;
    itemTitle: string;
    itemTitlePlaceholder: string;
    itemDescription: string;
    itemDescriptionPlaceholder: string;
    itemCategory: string;
    categories: {
      certificate: string;
      event: string;
      memory: string;
      achievement: string;
      other: string;
    };
    images: string;
    uploadImages: string;
    addMore: string;
    maxImages: string;
    cancel: string;
    save: string;
    add: string;
    editTitle: string;
    addTitle: string;
    confirmDelete: string;
    viewAll: string;
    close: string;
  };
  itNews: {
    title: string;
    subtitle: string;
    addNew: string;
    noNews: string;
    addFirst: string;
    newsTitle: string;
    newsTitlePlaceholder: string;
    newsContent: string;
    newsContentPlaceholder: string;
    imageLabel: string;
    uploadImage: string;
    changeImage: string;
    views: string;
    share: string;
    cancel: string;
    save: string;
    add: string;
    editTitle: string;
    addTitle: string;
    confirmDelete: string;
    shared: string;
    shareError: string;
  };
  cv: {
    title: string;
    subtitle: string;
    download: string;
    upload: string;
    uploadNew: string;
    noCv: string;
    uploadFirst: string;
    uploading: string;
    uploadSuccess: string;
    uploadError: string;
    deleteConfirm: string;
    deleteSuccess: string;
    deleteError: string;
    fileTypes: string;
    maxSize: string;
  };
  myProjects: {
    title: string;
    subtitle: string;
    viewProject: string;
    technologies: string;
    projects: ShowcaseProject[];
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    email: string;
    phone: string;
    location: string;
    locationValue: string;
    sendMessage: string;
    successMessage: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      telegram: string;
      telegramPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      send: string;
      sending: string;
    };
  };
  auth: {
    admin: string;
    profile: string;
    login: string;
    adminPanel: string;
    myProfile: string;
    loginRegister: string;
  };
  footer: string;
}
