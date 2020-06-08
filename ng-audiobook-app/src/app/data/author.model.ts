export class Author {
    count: number;
    next: any;
    previous: any;
    results: Array<AuthorEntity>;
}

export class AuthorEntity {
    author_name: string
}
