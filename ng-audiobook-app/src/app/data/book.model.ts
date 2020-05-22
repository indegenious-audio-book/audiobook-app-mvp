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
    folder_name: string;
    genre: number;
    number_of_chapters: number;
    thumbnail_url: string;
}


export class Chapter {
    count: number;
    next: any;
    previous: any;
    results: Array<ChapterEntity>;
}
export class ChapterEntity {
    chapter_id: number;
    chapter_title: string;
    book: number;
    chapter_url: string;
    chapter_number:number;
}
