#[allow(unused_imports)]
use crate::LinkedList;

pub fn run_tests() {
    let mut results = vec![];
    results.push(insert_empty_list_tests());
    results.push(insert_head_tests());
    results.push(insert_tail_tests());
    results.push(insert_mid_tests());
    results.push(insert_out_of_bounds_tests());

    println!();
    for result in results {
        println!("{result}");
    }
}



fn insert_empty_list_tests() -> &'static str {
    println!("\nRUNNING insert_empty_list_tests TESTS");
    let mut all_passed = true;

    // Test 1: Insert value 5 at index 0 (should succeed)
    let mut l = LinkedList::new();
    match l.insert(5, 0) {
        Ok(_) => {
            let expected = vec![5];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 1 FAILED: Inserting 5 into empty list.");
                println!("Expected: {:?}\nReceived: {:?}", expected, actual);
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 1 FAILED: Error inserting 5 into empty list.");
            println!("Error: {:?}", e);
            all_passed = false;
        }
    }

    // Test 2: Insert negative number (-3) at index 0
    let mut l = LinkedList::new();
    match l.insert(-3, 0) {
        Ok(_) => {
            let expected = vec![-3];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 2 FAILED: Inserting -3 into empty list.");
                println!("Expected: {:?}\nReceived: {:?}", expected, actual);
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 2 FAILED: Error inserting -3 into empty list.");
            println!("Error: {:?}", e);
            all_passed = false;
        }
    }

    // Test 3: Insert at index 1 in empty list (should fail)
    let mut l = LinkedList::new();
    match l.insert(42, 1) {
        Ok(_) => {
            println!("Test 3 FAILED: Inserted at index 1 in empty list, but should have failed.");
            all_passed = false;
        },
        Err(_) => {}
    }

    // Test 4: Insert at high index (10) in empty list (should fail)
    let mut l = LinkedList::new();
    match l.insert(99, 10) {
        Ok(_) => {
            println!("Test 4 FAILED: Inserted at index 10 in empty list, but should have failed.");
            all_passed = false;
        },
        Err(_) => {}
    }

    println!("Finished");
    if all_passed {
        "insert_empty_list_tests: PASSED"
    } else {
        "insert_empty_list_tests: FAILED"
    }
}


fn insert_head_tests() -> &'static str {
    println!("\nRUNNING insert_head_tests TESTS");
    let mut all_passed = true;


    let mut l = LinkedList::new();
    match l.insert(1, 0) {
        Ok(_) => {
            let expected = vec![1];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 1 FAILED: Inserting 1 into empty list.");
                println!("Expected: {:?}\nReceived: {:?}", expected, actual);
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 1 FAILED: Error inserting 1 into empty list.");
            println!("Error: {:?}", e);
            all_passed = false;
        }
    }


    match l.insert(2, 0) {
        Ok(_) => {
            let expected = vec![2, 1];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 2 FAILED: Inserting 2 at list head.");
                println!("Expected: {:?}\nReceived: {:?}", expected, actual);
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 2 FAILED: Error inserting 2 at list head.");
            println!("Error: {:?}", e);
            all_passed = false;
        }
    }


    match l.insert(5, 0) {
        Ok(_) => {
            let expected = vec![5, 2, 1];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 3 FAILED: Inserting 5 at list head.");
                println!("Expected: {:?}\nReceived: {:?}", expected, actual);
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 3 FAILED: Error inserting 5 at list head.");
            println!("Error: {:?}", e);
            all_passed = false;
        }
    }


    println!("Finished");
    if all_passed {
        "insert_head_tests: PASSED"
    } else {
        "insert_head_tests: FAILED"
    }
}



fn insert_tail_tests() -> &'static str {
    println!("\nRUNNING insert_tail_tests TESTS");
    let mut all_passed = true;


    let mut l = LinkedList::new();
    match l.insert(1, 0) {
        Ok(_) => {
            let expected = vec![1];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 1 FAILED: Inserting 1 into empty list.");
                println!("Expected: {:?}\nReceived: {:?}", expected, actual);
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 1 FAILED: Error inserting 1 into empty list.");
            println!("Error: {:?}", e);
            all_passed = false;
        }
    }


    match l.insert(2, 1) {
        Ok(_) => {
            let expected = vec![1, 2];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 2 FAILED: Inserting 2 at list tail.");
                println!("Expected: {:?}\nReceived: {:?}", expected, actual);
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 2 FAILED: Error inserting 2 at list tail.");
            println!("Error: {:?}", e);
            all_passed = false;
        }
    }


    match l.insert(-3, 2) {
        Ok(_) => {
            let expected = vec![1, 2, -3];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 3 FAILED: Inserting -3 at list tail.");
                println!("Expected: {:?}\nReceived: {:?}", expected, actual);
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 3 FAILED: Error inserting -3 at list tail.");
            println!("Error: {:?}", e);
            all_passed = false;
        }
    }


    println!("Finished");
    if all_passed {
        "insert_tail_tests: PASSED"
    } else {
        "insert_tail_tests: FAILED"
    }
}



fn insert_mid_tests() -> &'static str {
    println!("\nRUNNING insert_mid_tests TESTS");
    let mut all_passed = true;


    let mut l = LinkedList::new();
    l.insert(1, 0).ok();
    l.insert(2, 1).ok();
    l.insert(3, 2).ok();


    match l.insert(10, 2) {
        Ok(_) => {
            let expected = vec![1, 2, 10, 3];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 1 FAILED: Inserting 10 at index 2.");
                println!("Expected: {:?}\nReceived: {:?}", expected, actual);
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 1 FAILED: Error inserting 10 at index 2.");
            println!("Error: {:?}", e);
            all_passed = false;
        }
    }

    match l.insert(-5, 1) {
        Ok(_) => {
            let expected = vec![1,-5, 2, 10, 3];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 2 FAILED: Inserting -5 at index 1.");
                println!("Expected: {:?}\nReceived: {:?}", expected, actual);
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 2 FAILED: Error inserting -5 at index 1.");
            println!("Error: {:?}", e);
            all_passed = false;
        }
    }


    println!("Finished");
    if all_passed {
        "insert_mid_tests: PASSED"
    } else {
        "insert_mid_tests: FAILED"
    }
}


fn insert_out_of_bounds_tests() -> &'static str {
    println!("\nRUNNING insert_out_of_bounds_tests TESTS");
    let mut all_passed = true;


    let mut l = LinkedList::new();
    l.insert(1, 0).ok();

    let result = l.insert(2, 2); // invalid index
    if result.is_ok() {
        println!("Test 1 FAILED: expected error inserting at index 5, but insert succeeded.");
        all_passed = false;
    }

    let result = l.insert(2, usize::MAX); // invalid index
    if result.is_ok() {
        println!("Test 1 FAILED: expected error inserting at index 5, but insert succeeded.");
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "insert_out_of_bounds_tests: PASSED"
    } else {
        "insert_out_of_bounds_tests: FAILED"
    }
}
