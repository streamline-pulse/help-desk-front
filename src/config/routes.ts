export const routes = {
  home: "/",
  board: {
    root: "/board",
    profile: "/board/profil",
    groupSpace: {
      root: "/board/groupe",
      roles: "/board/groupe/roles",
      members: "/board/groupe/membres",
      invitations: "/board/groupe/invitations",
      files: "/board/groupe/fichiers",
    },
    employees: "/board/employees",
    configuration: {
      root: "/board/configuration",
      resource: (resource: string) => `/board/configuration/${resource}`,
    },
    roles: {
      root: "/board/roles",
      resource: (resource: string) => `/board/roles/${resource}`,
    },
    groupConfiguration: {
      root: "/board/group-configuration",
      resource: (resource: string) => `/board/group-configuration/${resource}`,
    },
    groups: {
      root: "/board/groupes",
      detail: (id: string) => `/board/groupes/${id}`,
      roles: (id: string) => `/board/groupes/${id}/roles`,
      members: (id: string) => `/board/groupes/${id}/membres`,
      invitations: (id: string) => `/board/groupes/${id}/invitations`,
      files: (id: string) => `/board/groupes/${id}/fichiers`,
    },
    users: "/board/utilisateurs",
  },

  auth: {
    signIn: "/auth/connexion",
    signUp: "/auth/inscription",
    forgotPassword: "/auth/mot-de-passe-oublie",
    verifyOtp: "/auth/verification-otp",
    resetPassword: "/auth/reinitialiser-mot-de-passe",
    acceptInvitation: "/auth/invitation",
  },

  dashboard: "/bord",

  requests: {
    all: "/demandes",
    new: "/demandes/nouvelle",
    detail: (id: string) => `/demandes/${id}`,
    edit: (id: string) => `/demandes/${id}/modifier`,
  },

  inbox: {
    all: "/boite-de-reception",
    detail: (id: string) => `/boite-de-reception/${id}`,
  },

  customers: {
    all: "/clients",
    new: "/clients/nouveau",
    detail: (id: string) => `/clients/${id}`,
    edit: (id: string) => `/clients/${id}/modifier`,
  },

  approvals: {
    all: "/approbations",
  },

  teams: {
    all: "/equipes",
    new: "/equipes/nouveau",
    detail: (id: string) => `/equipes/${id}`,
    edit: (id: string) => `/equipes/${id}/modifier`,
  },

  statistics: {
    all: "/statistiques",
  },

  notifications: {
    all: "/notifications",
  },

  settings: {
    root: "/parametres",
    general: "/parametres/general",
    security: "/parametres/securite",
    deployment: "/parametres/deploiement",
  },
} as const
