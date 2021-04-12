import { DocumentNode, GraphQLSchema, BuildSchemaOptions } from 'graphql';
import { GraphQLSchemaValidationOptions } from 'graphql/type/schema';
import { GraphQLParseOptions } from './Interfaces';

export interface Source {
  document?: DocumentNode;
  schema?: GraphQLSchema;
  rawSDL?: string;
  location?: string;
}

export interface Cacheable {
  cacheable?<TPointer, TOptions>(
    fn: (pointer: TPointer, options?: TOptions) => PromiseLike<Source | never>,
    pointer: TPointer,
    options?: TOptions
  ): Promise<Source | never>;
  cacheableSync?<TPointer, TOptions>(
    fn: (pointer: TPointer, options?: TOptions) => Source | never,
    pointer: TPointer,
    options?: TOptions
  ): Source | never;
}

export type SingleFileOptions = GraphQLParseOptions &
  GraphQLSchemaValidationOptions &
  BuildSchemaOptions &
  Cacheable & {
    cwd?: string;
  };

export type WithList<T> = T | T[];
export type ElementOf<TList> = TList extends Array<infer TElement> ? TElement : never;
export type SchemaPointer = WithList<string>;
export type SchemaPointerSingle = ElementOf<SchemaPointer>;
export type DocumentGlobPathPointer = string;
export type DocumentPointer = WithList<DocumentGlobPathPointer>;
export type DocumentPointerSingle = ElementOf<DocumentPointer>;

export interface Loader<TPointer = string, TOptions extends SingleFileOptions = SingleFileOptions> {
  cacheable?: boolean;
  loaderId(): string;
  canLoad(pointer: TPointer, options?: TOptions): Promise<boolean>;
  canLoadSync?(pointer: TPointer, options?: TOptions): boolean;
  load(pointer: TPointer, options?: TOptions): Promise<Source | never>;
  loadSync?(pointer: TPointer, options?: TOptions): Source | never;
}

export type SchemaLoader<TOptions extends SingleFileOptions = SingleFileOptions> = Loader<
  SchemaPointerSingle,
  TOptions
>;

export type DocumentLoader<TOptions extends SingleFileOptions = SingleFileOptions> = Loader<
  DocumentPointerSingle,
  TOptions
>;

export type UniversalLoader<TOptions extends SingleFileOptions = SingleFileOptions> = Loader<
  SchemaPointerSingle | DocumentPointerSingle,
  TOptions
>;
