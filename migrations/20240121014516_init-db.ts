import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('Auth', function (table) {
        table.increments('id').primary();
        table.string('miroUserId').unique();
        table.string('gitToken').unique();
        table.string('gitUserName').unique();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('UpdatedAt').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('Dashboard', function (table) {
        table.increments('id').primary();
        table.string('miroBoardId').notNullable();
        table.string('repoOwner').notNullable();
        table.string('repoOwnerType').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('UpdatedAt').defaultTo(knex.fn.now());

        table.unique(['miroBoardId', 'repoOwner', 'repoOwnerType']);
    });

    await knex.schema.createTable('PullRequestMapping', function (table) {
        table.increments('id').primary();
        table.integer('dashboardId').notNullable();
        table.string('miroBoardId').notNullable();
        table.string('miroAppCardId').unique();
        table.integer('pullNumber').notNullable();
        table.string('repoName').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('UpdatedAt').defaultTo(knex.fn.now());
      
        table.foreign('dashboardId').references('id').inTable('Dashboard');
    });

    await knex.schema.createTable('ReviewReservation', function (table) {
        table.increments('id').primary();
        table.string('miroAppCardId').notNullable();
        table.string('miroUserId').notNullable();
        table.string('miroUsername').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('UpdatedAt').defaultTo(knex.fn.now());

        table.unique(['miroAppCardId', 'miroUserId']);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('ReviewReservation');
    await knex.schema.dropTableIfExists('PullRequestMapping');
    await knex.schema.dropTableIfExists('Dashboard');
    await knex.schema.dropTableIfExists('Auth');
  }

