# NetExpress
## _.NET Inspired Express Wrapper_

GET/POST Controllers using Typescript decorators.

#### Step 1: Extend _Controller_

```ts
export class ReviewController extends Controller {}
```

#### Step 2: Provide Handlers Using _@Post()_ and/or _@Get()_

##### -@Post()
#
```ts
export class SoftwareController extends Controller {
    constructor(private db: DatabaseProcedures) {
        super();
    }
    
    @Post('/api/software/create')
    public CreateSoftware(@FromBody criteria: CreateSoftwareOptions): Promise<Software> {
        return this.db.CreateSoftware(criteria);
    }
}
```

##### -@Get()
#
```ts
export class SoftwareController extends Controller {
    constructor(private db: DatabaseProcedures) {
        super();
    }
    
    @Get('/api/software/version')
    public GetVersion(): Promise<string> {
        return Promise.resolve('1.2.0.0.1');
    }
}
```

#### Step 3: Use the _NetExpress_ interface
```ts
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import { NetExpress } from 'net-express';

const app: NetExpress = NetExpress.Init(
    express(),
    new ReviewController() // Example controller
    new SoftwareController() // Example controller
);

// Supply any additional express options that you may need
app.use(bodyParser.json());
app.use(cors({origin: process.env.ORIGIN}));

// Start your server
const port = process.env.PORT;

// All overloads supported. Here are a few examples.
app.listen(port);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
});
```

## Handler Argument Decorators

#### _@FromBody_ (POST ONLY)
Specifies that the argument will come from the body of the request.
```ts
@Post('/api/review/software/create')
public CreateSoftwareReview(@FromBody criteria: CreateSoftwareReviewOptions): Promise<SoftwareReview> {
    return this.db.CreateSoftwareReview(criteria);
}
```

#### _@FromRoute_
Specifies that the argument will come from the route of the request.

In the following example, assuming a POST request is made to /api/software/search/page/3/limit/50, the value of _page_ will be 3 and the value of _size_ will be 50.
```ts
@Post('/api/software/search/page/:page/limit/:size')
public SearchSoftware(@FromRoute('page') page: number, @FromRoute('size') size: number, @FromBody criteria: SearchSoftwareOptions): Promise<Software[]> {
    return this.db.SearchSoftware(page, size, criteria);
}
```

#### _@FromQuery_
Specifies that the argument will come from the query string of the request.

In the following example, assuming a GET request is made to /api/version?accessToken=576cd16c-f347-46a4-9be5-7741b6cb04ae, the value of _token_ will be "576cd16c-f347-46a4-9be5-7741b6cb04ae".
```ts
@Get('/api/version')
public async GetVersion(@FromQuery('accessToken') token: string): Promise<string> {
    const guid = await this.services.VerifyToken(token);
    const version = await this.db.GetAccessVersion(guid);

    return version;
}
```

## Installation

NPM:
```sh
npm i net-express
```

## License

MIT