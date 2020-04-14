export class Book {
    count: number;
    next: any;
    previous: any;
    results: Array<BookEntity>;
}

export class BookEntity {
    book_id: number;
    book_title: string;
    author_name: string;
    published_year: number;
}
